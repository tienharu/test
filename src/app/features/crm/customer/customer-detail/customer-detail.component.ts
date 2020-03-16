import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService, UserMasterService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { crmCustomerDetailModel } from '@app/core/models/crm/customer-detail.model';
import { crmCustomerDetailService, CrmActivityEmailService, CrmActivityTelService, CrmActivityMeetingService, CrmActivityIssueService } from '@app/core/services/crm/customer-detail.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { BasePage } from '@app/core/common/base-page';
import { TraderModel } from '@app/core/models/trader.model';
import { FunctionDefine, ProgramList } from '@app/core/common/static.enum';
import { EmailDetailComponent } from '../../common-activity/detail/email-detail/email-detail.component';
import { TelephoneDetailComponent } from '../../common-activity/detail/telephone-detail/telephone-detail.component';
import { ConferenceDetailComponent } from '../../common-activity/detail/conference-detail/conference-detail.component';
import { IssueDetailComponent } from '../../common-activity/detail/issue-detail/issue-detail.component';

@Component({
  selector: 'sa-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['../../common-activity/common-activity.css']
})
export class CustomerDetailComponent extends BasePage implements OnInit {
  @ViewChild("popupEmail") popupEmail;
  @ViewChild("popupTelephone") popupTelephone;
  @ViewChild("popupConference") popupConference;
  @ViewChild("popupIssue") popupIssue;
  @ViewChild("popupTraderEditData") popupTraderEditData;
  @ViewChild(EmailDetailComponent) emailDetail: EmailDetailComponent;
  @ViewChild(TelephoneDetailComponent) telDetail: TelephoneDetailComponent;
  @ViewChild(ConferenceDetailComponent) meetingDetail: ConferenceDetailComponent;
  @ViewChild(IssueDetailComponent) issueDetail: IssueDetailComponent;
  modalRef: BsModalRef;
  customerDetail : crmCustomerDetailModel;
  inputFuncId:number = FunctionDefine.CRM_CUSTOMER_MANAGEMENT.valueOf(); // type is customer
  funcRefCd : string = ''; // customer id
  traderId : string = '';
  // emailInfo : any[] = [];
  // telInfo : any[] = [];
  // meetingInfo : any[] = [];
  // issueInfo : any[] = [];
  keyName : string = ""; //determined info component loaded
  customer : any[]=[];
  contactor : any[]=[];
  user : any[]=[];
  userLogin : any;
  // indexExpandBusiness: number = -1;
  // indexExpandMail: number = -1;
  // indexExpandTel: number = -1;
  // indexExpandMeeting: number = -1;
  // indexExpandIssue: number = -1;
  // emailJson : any;
  // meetingJson : any;
  // issueJson : any;
  // telJson : any;
  // bussinessJson : any;
  showTab : boolean = false;
  //
  // emailId : number  = 0;
  // telId : number  = 0;
  // meetingId : number  = 0;
  // issueId : number  = 0;
  Id : number = 0;
  constructor(
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private crmCustomerDetailService: crmCustomerDetailService,
    private modalService: BsModalService,
    private crmActivityEmailService : CrmActivityEmailService,
    private crmActivityTelService :CrmActivityTelService,
    private crmActivityMeetingService :CrmActivityMeetingService,
    private crmActivityIssueService :CrmActivityIssueService,
    private traderService :TraderService,
    private contactorService : ContactorService,
    private userMasterService : UserMasterService,
    public userService: AuthService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Customer_Magt.valueOf());
    this.userLogin = this.userService.getUserInfo();
    this.customerDetail = this.crmCustomerDetailService.getModel();
    this.traderId = this.route.snapshot.paramMap.get("id");
    this.getCustomerDetail(this.traderId)
    this.funcRefCd = this.traderId;
    this.getCustomer();this.getContactor();this.getSytemUser();
  }
  getCustomerDetail(traderId) {
    this.crmCustomerDetailService.getDetail(traderId,true).then(data => {
      this.customerDetail = data;
      // console.log("this.traderInfo",this.customerDetail)
      setTimeout(() => {
        this.showTab = true;
      }, 500);
    })
  }
  reloadDetail(){
    this.getCustomerDetail(this.traderId)
  }

  
  getCustomer(){
    this.traderService.ListTrader(this.userLogin.company_id).then(data =>{
      this.customer.push(...data)
      this.customer.forEach(element => {
        element.with_type = 1;
      });
      console.log("this.customer",this.customer)
    })
  }
  getContactor(){
    this.contactorService.ListContactor(this.userLogin.company_id,'').then(data =>{
      this.contactor.push(...data)
      this.contactor.forEach(element => {
        element.with_type = 2;
      });
      console.log("this.contactor",this.contactor)
    })
  }
  getSytemUser(){
    this.userMasterService.listUsers().then(data =>{
      this.user.push(...data)
      console.log("this.user",this.user)
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
      case "email":
        this.emailDetail.getEmailInfo(this.customerDetail.company_id, this.inputFuncId, this.traderId)
        break;
      case "tel":
        this.telDetail.getTelInfo(this.customerDetail.company_id, this.inputFuncId, this.traderId)
        break;
      case "meeting":
        this.meetingDetail.getMeetingInfo(this.customerDetail.company_id, this.inputFuncId, this.traderId)
        break;
      case "issue":
        this.issueDetail.getIssueInfo(this.customerDetail.company_id, this.inputFuncId, this.traderId)
        break;
      default:
        break;
    }
  }
  //
  reloadData(){
    this.getCustomerDetail(this.traderId)
  }
  reloadList(keyName){
    if (this.keyName == keyName) {
    this.loadInfo(keyName);
    }
  }
  //edit----
  openEditTraderPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupTraderEditData, config);
  }
  closeCustomerPopup(){
    this.modalRef && this.modalRef.hide();
  }

}
