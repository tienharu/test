import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgramList, Category } from '@app/core/common/static.enum';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, UserMasterService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CrmProjectService } from '@app/core/services/crm/project.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmProjectModel } from '@app/core/models/crm/project.model';
import { EmailDetailComponent } from '../../common-activity/detail/email-detail/email-detail.component';
import { TelephoneDetailComponent } from '../../common-activity/detail/telephone-detail/telephone-detail.component';
import { ConferenceDetailComponent } from '../../common-activity/detail/conference-detail/conference-detail.component';
import { IssueDetailComponent } from '../../common-activity/detail/issue-detail/issue-detail.component';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';

@Component({
  selector: 'sa-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css','../../common-activity/common-activity.css']
})
export class ProjectDetailComponent extends BasePage implements OnInit {
  @ViewChild("popupSupport") popupSupport;
  @ViewChild("popupEmail") popupEmail;
  @ViewChild("popupTelephone") popupTelephone;
  @ViewChild("popupConference") popupConference;
  @ViewChild("popupIssue") popupIssue;
  @ViewChild("popupEditDetail") popupEditDetail;
  @ViewChild(EmailDetailComponent) emailDetail: EmailDetailComponent;
  @ViewChild(TelephoneDetailComponent) telDetail: TelephoneDetailComponent;
  @ViewChild(ConferenceDetailComponent) meetingDetail: ConferenceDetailComponent;
  @ViewChild(IssueDetailComponent) issueDetail: IssueDetailComponent;
  // @ViewChild(BusinessStatusDetailComponent) businessDetail: BusinessStatusDetailComponent;
  modalRef: BsModalRef;
  projectDetail: CrmProjectModel;
  projectId: string = '';
  keyName: string = ""; //determined info component loaded
  userLogin: any;
  Id: number = 0;
  inputFuncId: number = 4; // type is project
  funcRefCd: string = ''; // project id
  projectType: any[] =[];
  opportunities : CrmSalesOpportunityModel[] = [];
  customer: any[] = [];
  contactor: any[] = [];
  user: any[] = [];
  adminId:number=0;
  customerId:number = 0;
  showTab : boolean = false;
  constructor(
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private crmSalesProjectService: CrmProjectService,
    private modalService: BsModalService,
    public userService: AuthService,
    private crmSalesOpportunityService : CrmSalesOpportunityService,
    private traderService: TraderService,
    private contactorService: ContactorService,
    private userMasterService: UserMasterService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Project_Magt.valueOf());
    
    this.userLogin = this.userService.getUserInfo();
    this.projectDetail = this.crmSalesProjectService.getModel();
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.funcRefCd = this.projectId;
    this.getProjectType().then(data =>{
      this.projectType.push(...data)
    });
    this.getOpportunityShortList().then(data =>{
      this.opportunities = data;
    })
    this.getContactor()
    Promise.all([this.getCustomer(), this.getSytemUser()]).then(res => {
      this.getProjectDetail(this.projectId)
    });
  }
  getProjectDetail(ProjectId) {
    this.crmSalesProjectService.getDetail(ProjectId, true).then(data => {
      this.opportunities.forEach(opp => {
        if (data.salesopt_id == opp.salesopt_id) {
          data.salesopt_nm = opp.salesopt_nm;
          this.customer.forEach(cus => {
            if (cus.trader_id == opp.customer_id) {
              data.customer_nm = cus.trader_local_nm;
            }
          });
          this.user.forEach(user => {
            if (user.user_id == opp.admin_id) {
              data.admin_nm = user.user_nm;
            }
          });
        }
      });
      this.projectType.forEach(opp => {
        if (data.project_type_gen_cd == opp.gen_cd) {
          data.project_type_nm = opp.gen_nm
        }
      });
      setTimeout(() => {
      this.projectDetail = data;
        this.showTab = true;
      }, 500);
    })
    
  }
  getOpportunityShortList(){
    return this.crmSalesOpportunityService.ShortList(this.userLogin.company_id);
  }
  getProjectType(){
    return this.generalMasterService.listGeneralByCate(Category.ProjectType.valueOf())
  }
  getCustomer() {
    this.traderService.ShortList(this.userLogin.company_id).then(data => {
      this.customer.push(...data)
      this.customer.forEach(element => {
        element.with_type = 1;
      });
    })
  }
  getContactor() {
    this.contactorService.ShortList(this.userLogin.company_id).then(data => {
      this.contactor.push(...data)
      this.contactor.forEach(element => {
        element.with_type = 2;
      });
      console.log("this.contactor", this.contactor)
    })
  }
  getSytemUser() {
    this.userMasterService.listUsers().then(data => {
      this.user.push(...data)
    })
  }
   //-----
  openPopup(keyName) {
    this.Id = 0;
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    switch (keyName) {
      case 'support':
        this.modalRef = this.modalService.show(this.popupSupport, config);
        break;
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
      case "support":
        // this.businessDetail.getBusinessInfo(this.ProjectDetail.company_id, this.ProjectId,this.ProjectDetail.salesopt_nm)
        break;
      case "email":
        this.emailDetail.getEmailInfo(this.projectDetail.company_id, this.inputFuncId,this.funcRefCd)
        break;
      case "tel":
        this.telDetail.getTelInfo(this.projectDetail.company_id, this.inputFuncId,this.funcRefCd)
        break;
      case "meeting":
        this.meetingDetail.getMeetingInfo(this.projectDetail.company_id, this.inputFuncId,this.funcRefCd)
        break;
      case "issue":
        this.issueDetail.getIssueInfo(this.projectDetail.company_id, this.inputFuncId,this.funcRefCd)
        break;
      default:
        break;
    }
  }
  //
  reloadData() {
    this.getProjectDetail(this.projectId);
  }
  reloadList(keyName){
    if (keyName =='business') {
      this.reloadData();
    }
    if (this.keyName == keyName) {
      this.loadInfo(keyName);
      }
  }
  openEditDetailPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupEditDetail, config);
  }
  closeEditDetailPopup() {
    this.modalRef && this.modalRef.hide();
  }

}
