import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';
import { CrmActivityBusinessService } from '@app/core/services/crm/sale-opportunity.service';
import { Category } from '@app/core/common/static.enum';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';

@Component({
  selector: 'sa-business-status-detail',
  templateUrl: './business-status-detail.component.html',
  styleUrls: ['../../common-activity.css']
})
export class BusinessStatusDetailComponent extends BasePage implements OnInit {
  @Output() childCall = new EventEmitter();
  @ViewChild("popupBusiness") popupBusiness;
  modalRef: BsModalRef;
  saleActivityInfo: any[] = [];
  userLogin: any;
  companyId : any;
  opportunityId: any;
  SliderdefaultVal: any;
  Id : any;
  bussinessJson : any;
  indexExpand: number = -1;
  acitivityStatus: any[] = [];
  salesoptNm: string = '';
  constructor(
    private modalService: BsModalService,
    public userService: AuthService,
    private crmActivityBusinessService: CrmActivityBusinessService,
    private generalMasterService: GeneralMasterService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.userLogin = this.userService.getUserInfo();
    this.getActivitiStatus().then(data => {
      this.acitivityStatus.push(...data)
    })
  }
  getActivitiStatus() {
    return this.generalMasterService.listGeneralByCate(Category.ActivityStatus.valueOf())
  }
  getBusinessInfo(companyId, opportunityId,salesoptNm) {
    this.companyId = companyId;
    this.opportunityId = opportunityId;
    this.salesoptNm = salesoptNm;
    this.crmActivityBusinessService.getBusinessInfo(companyId, opportunityId).then(data => {
      this.saleActivityInfo = data.data;
      this.saleActivityInfo.forEach(activity => {
        this.acitivityStatus.forEach(status => {
          if (activity.sales_status_gen_cd == status.gen_cd) {
            activity.sales_status_gen_nm = status.gen_nm;
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
    this.bussinessJson = item;
    this.Id = item.activity_id;
    this.SliderdefaultVal = item.possibility;
        this.modalRef = this.modalService.show(this.popupBusiness, config);
    
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
  reloadData(fromChild) {
    this.getBusinessInfo(this.companyId,this.opportunityId,this.salesoptNm)
    this.childCall.emit('business');
  }
}
