import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CrmActivityTelService } from '@app/core/services/crm/customer-detail.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { UserMasterService, AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';

@Component({
  selector: 'sa-telephone-detail',
  templateUrl: './telephone-detail.component.html',
  styleUrls: ['../../common-activity.css']
})
export class TelephoneDetailComponent extends BasePage implements OnInit {
  @Output() childCall = new EventEmitter();
  @ViewChild("popupTelephone") popupTelephone;
  modalRef: BsModalRef;
  telInfo: any[] = [];
  userLogin: any;
  companyId : any;
  customer: any[] = [];
  contactor: any[] = [];
  user: any[] = [];
  telJson : any;
  inputFuncId : any;
  funcRefCd : any;
  Id : any;
  indexExpand: number = -1;

  constructor(
    private crmActivityTelService: CrmActivityTelService,
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
  getTelInfo(companyId,inputFuncId,funcRefCd) {
    this.companyId = companyId;
    this.inputFuncId = inputFuncId;
    this.funcRefCd =funcRefCd;
    this.crmActivityTelService.getTelInfo(companyId,inputFuncId,funcRefCd).then(data => {
      this.telInfo = data.data;
      this.telInfo.forEach(element => {
        element.tel_details.forEach(dt => {
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
    this.telJson = item;
    this.Id = item.tel_id;
        this.modalRef = this.modalService.show(this.popupTelephone, config);
    
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
  reloadData(fromChild) {
    this.getTelInfo(this.companyId, this.inputFuncId, this.funcRefCd)
    this.childCall.emit('tel');
  }
}
