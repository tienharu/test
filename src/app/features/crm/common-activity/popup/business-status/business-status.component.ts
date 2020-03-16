import { NotificationService, UserMasterService } from '@app/core/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CrmSalesActivityModel } from '@app/core/models/crm/sales-opportunity.model';
import { CrmActivityBusinessService } from '@app/core/services/crm/sale-opportunity.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'sa-business-status',
  templateUrl: './business-status.component.html',
  styleUrls: ['../../common-activity.css']
})
export class BusinessStatusComponent implements OnInit {
  @Output() childCall = new EventEmitter();
  @Input() companyId: number;
  @Input() opportunityId: number;
  @Input() Id : number = 0;
  @Input() SliderdefaultVal : number;
  @Input() opportunityDetailJson: string;
  @Input() bussinessJson: string;
  
  businessActivity : CrmSalesActivityModel;
  modalRef: BsModalRef;
  acitivityStatus : any[] = [];
  memoContent :any;
  issueContent :any;

  constructor(
    private notification: NotificationService,
    private crmActivityBusinessService : CrmActivityBusinessService,
    private userMasterService : UserMasterService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
  ) { }

  ngOnInit() {
    $('.activity-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.businessActivity.activity_ymd=selectedDate;
      }
    });
    $('.fin-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.businessActivity.activity_fin_ymd=selectedDate;
      }
    });
    this.crmActivityBusinessService.resetModel();
    this.businessActivity = this.crmActivityBusinessService.getModel();
    
    if (this.Id == 0) {
      if (!JSON.parse(this.opportunityDetailJson).sale_activitys) {
        this.businessActivity.activity_ymd = new Date().toISOString().split('T')[0];
        this.businessActivity.activity_fin_ymd = new Date().toISOString().split('T')[0];
        this.businessActivity.company_id = this.companyId;
        this.businessActivity.salesopt_id = this.opportunityId;
      }else{
        let _parse = JSON.parse(this.opportunityDetailJson);
        this.businessActivity = _parse.sale_activitys;
        this.businessActivity.activity_ymd = new Date().toISOString().split('T')[0];
        this.businessActivity.company_id = this.companyId;
        this.businessActivity.salesopt_id = this.opportunityId;
        this.businessActivity.purch_amt = 0;
        this.businessActivity.issue_text = "";
        this.businessActivity.memo_text = ""
        this.SliderdefaultVal = this.businessActivity.possibility;
        console.log("JSON.parse(this.opportunityDetailJson)",JSON.parse(this.opportunityDetailJson))

      }
      
    }else{
      this.getDataForUpdate();
      if (JSON.parse(this.bussinessJson)) {
        let par= JSON.parse(this.bussinessJson)
        this.issueContent = par.issue_text
        this.memoContent = par.memo_text
        }
    }
    this.getActivitiStatus().then(data =>{
      this.acitivityStatus.push(...data)
    })
  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      sales_status_gen_cd: {
        required: true
      },
      possibility: {
        required: true
      },
      expect_amt: {
        required: true
      },
      issue_text: {
        required: true
      },
      memo_text: {
        required: true
      },
      activity_ymd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      sales_status_gen_cd: {
        required: "Please select type"
      },
      possibility: {
        required: "Please select value"
      },
      expect_amt: {
        required: "Please enter"
      },
      issue_text: {
        required: "Please enter"
      },
      memo_text: {
        required: "Please enter"
      },
      activity_ymd: {
        required: "Please select"
      }
    }
  };
  getActivitiStatus(){
    return this.generalMasterService.listGeneralByCate(Category.ActivityStatus.valueOf())
  }
  getDataForUpdate(){
    this.crmActivityBusinessService.getBusinessDetail(this.opportunityId, this.Id).then(data =>{
      this.businessActivity = data;
      // this.issueContent = data.issue_text
      //   this.memoContent = data.memo_text
    })
  }
  
  onSubmit() {
    this.businessActivity.issue_text=$('.issueContent .note-editable').html();
    this.businessActivity.memo_text=$('.memoContent .note-editable').html();
    this.crmActivityBusinessService.insertActivityBusiness(this.businessActivity).then(data =>{
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit('business');
      }
   })
  }
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmActivityBusinessService.resetModel();
    this.businessActivity = this.crmActivityBusinessService.getModel();
    this.businessActivity.activity_ymd = new Date().toISOString().split('T')[0];
        this.businessActivity.activity_fin_ymd = new Date().toISOString().split('T')[0];
        this.businessActivity.company_id = this.companyId;
        this.businessActivity.salesopt_id = this.opportunityId;
        this.SliderdefaultVal = 0;
  }

onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmActivityBusinessService.DeleteActivityBusiness(this.businessActivity).then(data =>{
          if (!data.success) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.childCall.emit('business');
          }
        })
      }
    }
  );
}
onClose(){
  this.modalService.hide(1);
}
}
