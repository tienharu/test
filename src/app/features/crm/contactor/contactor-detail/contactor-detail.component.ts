import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService, UserMasterService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  CrmActivityEmailService, CrmActivityTelService, CrmActivityMeetingService, CrmActivityIssueService } from '@app/core/services/crm/customer-detail.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { BasePage } from '@app/core/common/base-page';
import { crmContactorDetailModel } from '@app/core/models/crm/contactor-detail.model';
import { crmContactorDetailService } from '@app/core/services/crm/contactor-detail.service';
import { ProgramList } from '@app/core/common/static.enum';
import { EmailDetailComponent } from '../../common-activity/detail/email-detail/email-detail.component';
import { TelephoneDetailComponent } from '../../common-activity/detail/telephone-detail/telephone-detail.component';
import { ConferenceDetailComponent } from '../../common-activity/detail/conference-detail/conference-detail.component';
import { IssueDetailComponent } from '../../common-activity/detail/issue-detail/issue-detail.component';

@Component({
  selector: 'sa-contactor-detail',
  templateUrl: './contactor-detail.component.html',
  styleUrls: ['./contactor-detail.component.css']
})
export class ContactorDetailComponent extends BasePage implements OnInit {
  @ViewChild("popupEmail") popupEmail;
  @ViewChild("popupTelephone") popupTelephone;
  @ViewChild("popupConference") popupConference;
  @ViewChild("popupIssue") popupIssue;
  @ViewChild("popupContactorEditData") popupContactorEditData;
  @ViewChild(EmailDetailComponent) emailDetail: EmailDetailComponent;
  @ViewChild(TelephoneDetailComponent) telDetail: TelephoneDetailComponent;
  @ViewChild(ConferenceDetailComponent) meetingDetail: ConferenceDetailComponent;
  @ViewChild(IssueDetailComponent) issueDetail: IssueDetailComponent;
  modalRef: BsModalRef;
  contactorDetail : crmContactorDetailModel;
  inputFuncId:number = 2; // type is contactor
  funcRefCd : string = ''; // contactor id
  contactorId : string = '';
  
  keyName : string = ""; //determined info component loaded
  customer : any[]=[];
  contactor : any[]=[];
  user : any[]=[];
  userLogin : any;
  Id : number = 0;
  
  showTab : boolean = false;
  constructor(
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private crmContactorDetailService: crmContactorDetailService,
    private modalService: BsModalService,
    private crmActivityEmailService : CrmActivityEmailService,
    private crmActivityTelService :CrmActivityTelService,
    private crmActivityMeetingService :CrmActivityMeetingService,
    private crmActivityIssueService :CrmActivityIssueService,
    private contactorService : ContactorService,
    private userMasterService : UserMasterService,
    public userService: AuthService,
   
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Contactor_Magt.valueOf());
    this.userLogin = this.userService.getUserInfo();
    this.contactorDetail = this.crmContactorDetailService.getModel();
    this.contactorId = this.route.snapshot.paramMap.get("id");
    this.getContactorDetail(this.companyInfo.company_id,this.contactorId)
    this.funcRefCd = this.contactorId;
    this.getCustomer();this.getContactor();this.getSytemUser();
  }
  getContactorDetail(companyId,contactorId) {
    this.crmContactorDetailService.getDetail(companyId,contactorId,true).then(data => {
      this.contactorDetail = data;
      setTimeout(() => {
        this.showTab = true;
      }, 500);
    })
  }

  
  getCustomer() {
    this.contactorService.ListTrader(this.userLogin.company_id).then(data => {
      this.customer.push(...data)
      this.customer.forEach(element => {
        element.with_type = 1;
      });
      console.log("this.customer", this.customer)
    })
  }
  getContactor(){
    this.contactorService.ListContactor(this.userLogin.company_id,'').then(data =>{
      this.contactor.push(...data)
      this.contactor.forEach(element => {
        element.with_type = 2;
      });
    })
  }
  getSytemUser(){
    this.userMasterService.listUsers().then(data =>{
      this.user.push(...data)
    })
  }

  //-----
  openPopup(keyName){
    this.Id = 0;
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    switch (keyName) {
      case 'email':
        this.modalRef = this.modalService.show(this.popupEmail, config);
        break;
      case 'tel':
        this.modalRef = this.modalService.show(this.popupTelephone, config);
        break;
      case 'meeting':
        this.modalRef = this.modalService.show(this.popupConference, config);
        break;
      case 'issue':
        this.modalRef = this.modalService.show(this.popupIssue, config);
        break;
      default:
        break;
    }
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  loadInfo(keyName) {
    this.keyName = keyName;
    switch (keyName) {
      case "business":
        break;
      case "email":
        this.emailDetail.getEmailInfo(this.contactorDetail.company_id, this.inputFuncId, this.contactorId)
        break;
      case "tel":
        this.telDetail.getTelInfo(this.contactorDetail.company_id, this.inputFuncId, this.contactorId)
        break;
      case "meeting":
        this.meetingDetail.getMeetingInfo(this.contactorDetail.company_id, this.inputFuncId, this.contactorId)
        break;
      case "issue":
        this.issueDetail.getIssueInfo(this.contactorDetail.company_id, this.inputFuncId, this.contactorId)
        break;
      default:
        break;
    }
  }
  //
  reloadData() {
    console.log("reload")
    this.getContactorDetail(this.companyInfo.company_id,this.contactorId);
  }
  reloadList(keyName){
    if (keyName =='business') {
      this.reloadData();
    }
    if (this.keyName == keyName) {
      this.loadInfo(keyName);
      }
  }

  //edit----
  openContactorPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupContactorEditData, config);
  }
  closeContactorPopup() {
    this.modalRef && this.modalRef.hide();
  }

}
