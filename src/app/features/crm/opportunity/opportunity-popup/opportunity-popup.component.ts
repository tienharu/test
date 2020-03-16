import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, UserMasterService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BsModalService } from 'ngx-bootstrap';
import { parse } from 'path';
import { Router } from '@angular/router';

@Component({
  selector: 'sa-opportunity-popup',
  templateUrl: './opportunity-popup.component.html',
  styleUrls: ['../opportunity-master/opportunity-master.component.css']
})
export class OpportunityPopupComponent extends BasePage implements OnInit {
  opportunityInfo : CrmSalesOpportunityModel;
  adminInChage : any[] = [];
  // saleType : any[] = [];
  // customer: any[] = [];
  // contactor : any [] = [];
  // user : any[]=[];
  userLogin : any;
  theSameCheck : boolean = false;
  @Input() EditDetailJson: any;
  @Input() customer: any;
  @Input() contactor: any;
  @Input() user: any;
  @Input() saleType: any;
  @Output() childCall = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public generalMasterService: GeneralMasterService,
    private crmSalesOpportunityService: CrmSalesOpportunityService,
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
    this.checkPermission(ProgramList.Sales_Opportunity.valueOf());
    if (!this.saleType || !this.customer|| !this.contactor|| !this.user) {
      this.notification.showMessage("danger","data is not loaded")
    }else{
      this.saleType = JSON.parse(this.saleType);
      this.customer = JSON.parse(this.customer);
      this.contactor = JSON.parse(this.contactor);
      this.user = JSON.parse(this.user);
    }

    this.userLogin = this.userService.getUserInfo();
    this.opportunityInfo = this.crmSalesOpportunityService.resetModel();
    this.opportunityInfo = this.crmSalesOpportunityService.getModel();
    this.opportunityInfo.company_id = this.userLogin.company_id;
    if (this.EditDetailJson) {
      this.opportunityInfo = JSON.parse(this.EditDetailJson);
      let info = this.opportunityInfo;
      if (info.contractor_id == info.customer_id && info.contractor_contactor_id == info.customer_contactor_id) {
        this.theSameCheck = true;
      }
    }
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      salesopt_nm: {
        required: true
      },
      salesopt_type_gen_cd: {
        required: true
      },
      admin_id: {
        required: true
      },
      contractor_id: {
        required: true
      },
      contractor_contactor_id: {
        required: true
      },
      customer_id: {
        required: true
      },
      customer_contactor_id: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      salesopt_nm: {
        required: "Please enter"
      },
      salesopt_type_gen_cd: {
        required: "Please select"
      },
      admin_id: {
        required: "Please select"
      },
      contractor_id: {
        required: "Please select"
      },
      contractor_contactor_id: {
        required: "Please select"
      },
      customer_id: {
        required: "Please select"
      },
      customer_contactor_id: {
        required: "Please select"
      }
    }
  };
  makeTheSame(e){
    let ct = this.opportunityInfo.contractor_id;
    let ct_ct = this.opportunityInfo.contractor_contactor_id ;
    if (ct == 0 || ct_ct == 0 || !ct || !ct_ct) {
      this.notification.showMessage("warning", "select Contractor and Contractor person first!");
      e.preventDefault();
    }else{
      this.opportunityInfo.customer_id = this.opportunityInfo.contractor_id;
      this.opportunityInfo.customer_contactor_id = this.opportunityInfo.contractor_contactor_id;
    }
  }
  onSubmit() {
    this.crmSalesOpportunityService.InsertSalesOpportunity(this.opportunityInfo).then(data => {
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
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmSalesOpportunityService.resetModel();
    this.opportunityInfo = this.crmSalesOpportunityService.getModel();
    this.opportunityInfo.company_id=this.userLogin.company_id;
    this.theSameCheck = false;
  }  
  sharingToSelected(data){
    this.opportunityInfo.sharing_to=data;
}
onClose(){
  this.modalService.hide(1);
}
onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmSalesOpportunityService.DeleteSalesOpportunity(this.opportunityInfo).then(data => {
          if (data.error) {
            if (data.error.code === 403) {
              this.modalService.hide(1);
              this.router.navigate(["/error/error403"]);
            }
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.router.navigate(['/crm-sales-opportunity']);
          }
        })
      }
    }
  );
}
}

