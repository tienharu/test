import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CrmProjectModel } from '@app/core/models/crm/project.model';
import { NotificationService, UserMasterService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BasePage } from '@app/core/common/base-page';
import { CrmProjectService } from '@app/core/services/crm/project.service';
import { Category, ProgramList } from '@app/core/common/static.enum';

@Component({
  selector: 'sa-project-popup',
  templateUrl: './project-popup.component.html',
  styleUrls: ['../project-master/project-master.component.css']
})
export class ProjectPopupComponent extends BasePage implements OnInit {
  @ViewChild("popupFindOpportunity") popupFindOpportunity;
  @Output() childCall = new EventEmitter();
  @Input() projectType : string ;
  projectInfo : CrmProjectModel;
  userLogin : any;
  modalRef: BsModalRef;
  constructor(
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private crmProjectService : CrmProjectService,
    private traderService :TraderService,
    private contactorService : ContactorService,
    private userMasterService : UserMasterService,
    public userService: AuthService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Project_Magt.valueOf());
    this.userLogin = this.userService.getUserInfo();
    this.projectInfo = this.crmProjectService.resetModel();
    this.projectInfo = this.crmProjectService.getModel();
    this.projectInfo.company_id = this.userLogin.company_id;

    if (this.projectType) {
      this.projectType = JSON.parse(this.projectType)
    }
    this.projectInfo.start_ymd = new Date().toISOString().split('T')[0];
    this.projectInfo.end_ymd = new Date().toISOString().split('T')[0];
    $('.start-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.projectInfo.start_ymd = selectedDate;
      }
    });
    $('.end-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.projectInfo.end_ymd = selectedDate;
      }
    });
  }
  
  validationOptions:any={};
  EditDetailJson:any={};

  openPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupFindOpportunity, config);
  }
  dataFromFindOpp(item){
    console.log("item",item)
    if (item) {
      this.projectInfo.salesopt_id = item.salesopt_id;
      this.projectInfo.salesopt_nm = item.salesopt_nm;
      this.projectInfo.customer_id = item.customer_id;
      this.projectInfo.customer_nm = item.customer_nm;
      this.projectInfo.contractor_id = item.contractor_id;
      this.projectInfo.contractor_nm = item.contractor_nm;

    }
    this.modalRef && this.modalRef.hide();
  }
  removeOpportunity(){
    this.projectInfo.salesopt_id = undefined;
      this.projectInfo.salesopt_nm = undefined;
      this.projectInfo.customer_id = undefined;
      this.projectInfo.customer_nm = undefined;
      this.projectInfo.contractor_id = undefined;
      this.projectInfo.contractor_nm = undefined;
  }
  onSubmit(){
    this.crmProjectService.InsertProject(this.projectInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit();
      }
    });
  }

  sharingToSelected(data){
    this.projectInfo.sharing_to=data;
  }
  onClose(){
    this.modalService.hide(1);
  }
  onReset(){
    
  }
}
