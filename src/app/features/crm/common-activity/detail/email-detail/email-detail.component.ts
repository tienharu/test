import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CrmActivityEmailService } from '@app/core/services/crm/customer-detail.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { UserMasterService, AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';

@Component({
  selector: 'sa-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['../../common-activity.css']
})
export class EmailDetailComponent extends BasePage implements OnInit {
  @Output() childCall = new EventEmitter();
  @ViewChild("popupEmail") popupEmail;
  modalRef: BsModalRef;
  emailInfo: any[] = [];
  userLogin: any;
  companyId : any;
  customer: any[] = [];
  contactor: any[] = [];
  user: any[] = [];
  emailJson : any;
  inputFuncId : any;
  funcRefCd : any;
  Id : any;
  indexExpand: number = -1;

  constructor(
    private crmActivityEmailService: CrmActivityEmailService,
    private modalService: BsModalService,
    private traderService: TraderService,
    private contactorService: ContactorService,
    private userMasterService: UserMasterService,
    public userService: AuthService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.userLogin = this.userService.getUserInfo();
    this.getCustomer(), this.getContactor(), this.getSytemUser();
  }
  getCustomer() {
    this.traderService.ListTrader(this.userLogin.company_id).then(data => {
      this.customer.push(...data)
      this.customer.forEach(element => {
        element.with_type = 1;
      });
    })
  }
  getContactor() {
    this.contactorService.ListContactor(this.userLogin.company_id, '').then(data => {
      this.contactor.push(...data)
      this.contactor.forEach(element => {
        element.with_type = 2;
      });
    })
  }
  getSytemUser() {
    this.userMasterService.listUsers().then(data => {
      this.user.push(...data)
    })
  }
  getEmailInfo(companyId,inputFuncId,funcRefCd) {
    this.companyId = companyId;
    this.inputFuncId = inputFuncId;
    this.funcRefCd =funcRefCd;
    this.crmActivityEmailService.getEmailInfo(companyId,inputFuncId,funcRefCd).then(data => {
      this.emailInfo = data.data;
      this.emailInfo.forEach(element => {
        element.email_details.forEach(dt => {
          if (dt.person_type === 0) {
            this.customer.forEach(cs => {
              if (dt.with_ref_id == cs.trader_id) {
                dt.name = cs.trader_eng_nm;
              }
            });
          } else if (dt.person_type == 1) {
            this.user.forEach(us => {
              if (dt.with_ref_id == us.user_id) {
                dt.name = us.user_nm;
              }
            });
          } else {
            this.contactor.forEach(us => {
              if (dt.with_ref_id == us.contactor_id) {
                dt.name = us.contactor_nm;
              }
            });
          }
        });
      });
      this.indexExpand = -1;
      this.subStringContent();
    })
  }
  subStringContent(){
    $(document).ready(function(){
      $(".content-title").text(function(index, currentText) {
        var maxLength = $(this).attr('data-maxlength');
          if(currentText.length >= maxLength) {
            return currentText.substr(0, maxLength) + "...";
          } else {
            return currentText
          } 
      });
    })
  }
  Expand(index){
    this.indexExpand == index? this.indexExpand = -1 : this.indexExpand = index;
    this.subStringContent();
  }
  collapse(){
    this.indexExpand = -1;
    this.subStringContent();
  }
  openPopup(item) {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.emailJson = item;
    this.Id = item.email_id;
        this.modalRef = this.modalService.show(this.popupEmail, config);
    
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
  reloadData(fromChild) {
    this.getEmailInfo(this.companyId, this.inputFuncId, this.funcRefCd);
    this.childCall.emit('email');
  }
}
