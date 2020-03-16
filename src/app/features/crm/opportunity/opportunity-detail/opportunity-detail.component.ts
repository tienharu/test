import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { NotificationService, UserMasterService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrmActivityEmailService, CrmActivityTelService, CrmActivityMeetingService, CrmActivityIssueService } from '@app/core/services/crm/customer-detail.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { BasePage } from '@app/core/common/base-page';
import { CrmSalesOpportunityModel, CrmSalesActivityModel } from '@app/core/models/crm/sales-opportunity.model';
import { CrmSalesOpportunityService, CrmActivityBusinessService } from '@app/core/services/crm/sale-opportunity.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { promise } from 'protractor';
import { EmailDetailComponent } from '../../common-activity/detail/email-detail/email-detail.component';
import { TelephoneDetailComponent } from '../../common-activity/detail/telephone-detail/telephone-detail.component';
import { ConferenceDetailComponent } from '../../common-activity/detail/conference-detail/conference-detail.component';
import { IssueDetailComponent } from '../../common-activity/detail/issue-detail/issue-detail.component';
import { BusinessStatusDetailComponent } from '../../common-activity/detail/business-status-detail/business-status-detail.component';

@Component({
  selector: 'sa-opportunity-detail',
  templateUrl: './opportunity-detail.component.html',
  styleUrls: ['../../common-activity/common-activity.css']
})
export class OpportunityDetailComponent extends BasePage implements OnInit {
  @ViewChild("popupBusiness") popupBusiness;
  @ViewChild("popupEmail") popupEmail;
  @ViewChild("popupTelephone") popupTelephone;
  @ViewChild("popupConference") popupConference;
  @ViewChild("popupIssue") popupIssue;
  @ViewChild("popupEditDetail") popupEditDetail;
  @ViewChild(EmailDetailComponent) emailDetail: EmailDetailComponent;
  @ViewChild(TelephoneDetailComponent) telDetail: TelephoneDetailComponent;
  @ViewChild(ConferenceDetailComponent) meetingDetail: ConferenceDetailComponent;
  @ViewChild(IssueDetailComponent) issueDetail: IssueDetailComponent;
  @ViewChild(BusinessStatusDetailComponent) businessDetail: BusinessStatusDetailComponent;
  modalRef: BsModalRef;
  opportunityDetail: CrmSalesOpportunityModel;
  inputFuncId: number = 3; // type is opportunity
  funcRefCd: string = ''; // Opportunity id
  opportunityId: string = '';

  keyName: string = ""; //determined info component loaded
  customer: any[] = [];
  contactor: any[] = [];
  user: any[] = [];
  userLogin: any;
  Id: number = 0;
  saleType: any[] = [];
  acitivityStatus: any[] = [];
  SliderdefaultVal: number = 0;
  isShow : boolean = false;

  showTab : boolean = false;
  constructor(
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private crmSalesOpportunityService: CrmSalesOpportunityService,
    private modalService: BsModalService,
    private traderService: TraderService,
    private contactorService: ContactorService,
    private userMasterService: UserMasterService,
    public userService: AuthService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Sales_Opportunity.valueOf());
    
    this.userLogin = this.userService.getUserInfo();
    this.opportunityDetail = this.crmSalesOpportunityService.getModel();
    this.opportunityId = this.route.snapshot.paramMap.get("id");
    this.funcRefCd = this.opportunityId;

    Promise.all([this.getCustomer(), this.getContactor(), this.getSytemUser(), this.getSaleType()]).then(res => {
      setTimeout(() => {
        this.getOpportunityDetail(this.opportunityId)
      }, 100);
    });
    this.getActivitiStatus().then(data => {
      this.acitivityStatus.push(...data)
    })
    $("#progressRate").css('width', '0%');
    $("#porgressPossibility").css('width', '0%');
  }
  getOpportunityDetail(opportunityId) {
    this.isShow = false;
    this.crmSalesOpportunityService.getDetail(opportunityId, true).then(data => {
      this.opportunityDetail = data;

      this.saleType.forEach(saletype => {
        if (this.opportunityDetail.salesopt_type_gen_cd == saletype.gen_cd) {
          this.opportunityDetail.salesopt_type_nm = saletype.gen_nm;
        }
      });
      this.customer.forEach(cs => {
        if (this.opportunityDetail.contractor_id == cs.trader_id) {
          this.opportunityDetail.contractor_nm = cs.trader_local_nm;
        }
        if (this.opportunityDetail.customer_id == cs.trader_id) {
          this.opportunityDetail.customer_nm = cs.trader_local_nm;
        }
      });
      this.contactor.forEach(ct => {
        if (this.opportunityDetail.contractor_contactor_id == ct.contactor_id) {
          this.opportunityDetail.contractor_contactor_nm = ct.contactor_nm;
        }
        if (this.opportunityDetail.customer_contactor_id == ct.contactor_id) {
          this.opportunityDetail.customer_contactor_nm = ct.contactor_nm;
        }
      });
      this.user.forEach(us => {
        if (this.opportunityDetail.admin_id == us.user_id) {
          this.opportunityDetail.admin_nm = us.user_nm;
        }
      });
      if (this.opportunityDetail.sale_activitys) {
        this.acitivityStatus.forEach((status, index, arr) => {
          if (this.opportunityDetail.sale_activitys.sales_status_gen_cd == status.gen_cd) {
            this.opportunityDetail.sale_activitys.sales_status_gen_nm = status.gen_nm;
            this.opportunityDetail.sale_activitys.sales_status_num = status.number_value_1;
  
          }
          if (index == this.acitivityStatus.length - 1) {
            $("#progressRate").css('width', `${this.opportunityDetail.sale_activitys.sales_status_num}%`);
            $("#porgressPossibility").css('width', `${this.opportunityDetail.sale_activitys.possibility}%`);
            switch (this.opportunityDetail.sale_activitys.sales_status_num) {
              case 0:
              this.isShow = true;
                break;
              case 20:
              $("#progressRate").css('background-color', '#f6860f');
                break;
                case 40:
                $("#progressRate").css('background-color', '#f6c70f');
                  break;
                  case 60:
              $("#progressRate").css('background-color', '#f2f60f');
                break;
                case 80:
              $("#progressRate").css('background-color', '#d3f60f');
                break;
                case 100:
              $("#progressRate").css('background-color', '#acf60f');
                break;
              default:
              $("#progressRate").css('background-color', '#f42323');
                break;
            }
            switch (true) {
              case (this.opportunityDetail.sale_activitys.possibility <= 20):
                $("#porgressPossibility").css('background-color', '#f6860f');
                break;
              case (this.opportunityDetail.sale_activitys.possibility <= 40):
                $("#porgressPossibility").css('background-color', '#f6c70f');
                break;
              case (this.opportunityDetail.sale_activitys.possibility <= 60):
                $("#porgressPossibility").css('background-color', '#f2f60f');
                break;
              case (this.opportunityDetail.sale_activitys.possibility <= 80):
                $("#porgressPossibility").css('background-color', '#d3f60f');
                break;
                case (this.opportunityDetail.sale_activitys.possibility <= 99):
                $("#porgressPossibility").css('background-color', '#c7ea00');
                break;
              case (this.opportunityDetail.sale_activitys.possibility == 100):
                $("#porgressPossibility").css('background-color', '#acf60f');
                break;
              default:
              $("#porgressPossibility").css('background-color', '#f42323');
                break;
            }
  
          }
        });
      }
      setTimeout(() => {
        this.showTab = true;
      }, 500);
    })
  }
  getSaleType() {
    this.generalMasterService.listGeneralByCate(Category.SalesOptType.valueOf()).then(data => {
      this.saleType.push(...data);
    });
  }
  getCustomer() {
    this.traderService.ShortList(this.userLogin.company_id).then(data => {
      this.customer.push(...data)
      this.customer.forEach(element => {
        element.with_type = 1;
      });
      console.log("this.customer", this.customer)
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
      console.log("this.user", this.user)
    })
  }
  getActivitiStatus() {
    return this.generalMasterService.listGeneralByCate(Category.ActivityStatus.valueOf())
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
      case 'business':
        this.modalRef = this.modalService.show(this.popupBusiness, config);
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
      case "business":
        this.businessDetail.getBusinessInfo(this.opportunityDetail.company_id, this.opportunityId,this.opportunityDetail.salesopt_nm)
        break;
      case "email":
        this.emailDetail.getEmailInfo(this.opportunityDetail.company_id, this.inputFuncId, this.opportunityId)
        break;
      case "tel":
        this.telDetail.getTelInfo(this.opportunityDetail.company_id, this.inputFuncId, this.opportunityId)
        break;
      case "meeting":
        this.meetingDetail.getMeetingInfo(this.opportunityDetail.company_id, this.inputFuncId, this.opportunityId)
        break;
      case "issue":
        this.issueDetail.getIssueInfo(this.opportunityDetail.company_id, this.inputFuncId, this.opportunityId)
        break;
      default:
        break;
    }
  }
  //
  reloadData() {
    this.getOpportunityDetail(this.opportunityId);
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
