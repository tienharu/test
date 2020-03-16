import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { crmActivityIssueDetailModel, CrmActivityIssueModel } from '@app/core/models/crm/activity-issue.model';
import { NotificationService, UserMasterService } from '@app/core/services';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CrmActivityIssueService } from '@app/core/services/crm/customer-detail.service';

@Component({
  selector: 'sa-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['../../common-activity.css']
})
export class IssueComponent implements OnInit {
  @Output() childCall = new EventEmitter();
  @Input() companyId: number;
  @Input() inputFuncId: number;
  @Input() funcRefCd: number;
  @Input() Id : number = 0;
  @Input() issueJson : string;
  @Input() customer : string;
  @Input() contactor : string;
  @Input() user : string;
  issueActivity : CrmActivityIssueModel;
  issue_ymd: any;

  modalRef: BsModalRef;
  default : any[] = [];
  additional : any[] = [];
  flagDefault :boolean = false;
  flagAddition :boolean = false;
  defaultContent :any;
  
  selectListModel : crmActivityIssueDetailModel;

  default_selectlist : crmActivityIssueDetailModel[] =[];
  additional_selectlist : crmActivityIssueDetailModel[] =[];
  constructor(
    private notification: NotificationService,
    private crmActivityIssueService : CrmActivityIssueService,
    private traderService :TraderService,
    private contactorService : ContactorService,
    private userMasterService : UserMasterService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    $('.issue-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.issueActivity.issue_ymd=selectedDate;
      }
    });
    this.customer=JSON.parse(this.customer);
    this.contactor=JSON.parse(this.contactor);
    this.user=JSON.parse(this.user);
    this.crmActivityIssueService.resetModel();
    this.issueActivity = this.crmActivityIssueService.getModel();
    if (this.Id == 0) {
      this.issueActivity.issue_ymd = new Date().toISOString().split('T')[0];
      this.issueActivity.company_id = this.companyId;
      this.issueActivity.input_func_id = this.inputFuncId;
      this.issueActivity.func_ref_id = this.funcRefCd;
    }else{
      this.getDataForUpdate();
      if (JSON.parse(this.issueJson).contents) {
        this.defaultContent = JSON.parse(this.issueJson).contents
        }
    }
    
  }

  
  getDataForUpdate(){
    this.crmActivityIssueService.getIssueDetail(this.companyId, this.inputFuncId, this.funcRefCd,this.Id).then(data =>{
      this.issueActivity = data;
      this.issueActivity.issue_details.forEach(element => {
        if (element.default_yn == true) {
          let val = element.with_type+"-"+element.with_ref_id;
          this.default.push(val)
        }else{
          let val = element.with_type+"-"+element.with_ref_id+"-"+element.person_type;
          this.additional.push(val)
        }
      });
      setTimeout(() => {
        $("#default").val(this.default);
          $("#default").select2();
          $("#additional").val(this.additional);
          $("#additional").select2();
      }, 100);
    })
  }
  validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      title_nm: {
        required: true
      },
      issue_ymd: {
        required: true
      },
      contents: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      title_nm: {
        required: "Please enter"
      },
      issue_ymd: {
        required: "Please select"
      },
      contents: {
        required: "Please enter"
      }
    }
  };
getDefaultSelect(value) {
  this.flagDefault = true;
  this.default_selectlist = [];
  value.forEach(element => {
    this.selectListModel = new crmActivityIssueDetailModel()
    let info = element.split('-');
    this.selectListModel.company_id = this.companyId;
    this.selectListModel.input_func_id = this.inputFuncId;
    this.selectListModel.func_ref_id = this.funcRefCd;
    this.selectListModel.with_type = info[0]
    this.selectListModel.with_ref_id = info[1]
    this.selectListModel.with_type == 2 ? this.selectListModel.person_type = 2 : this.selectListModel.person_type = 0;
    this.selectListModel.default_yn =true;
    this.default_selectlist.push(this.selectListModel)
  });
}
getAdditionSelect(value) {
  this.flagAddition = true;
  this.additional_selectlist = [];
  for (let item of value) {
    this.selectListModel = new crmActivityIssueDetailModel()
    let info = item.split('-');
    this.selectListModel.company_id = this.companyId;
    this.selectListModel.input_func_id = this.inputFuncId;
    this.selectListModel.func_ref_id = this.funcRefCd;
    this.selectListModel.with_type = info[0]
    this.selectListModel.with_ref_id = info[1]
    this.selectListModel.person_type = info[2]
    this.selectListModel.default_yn =false;
    this.additional_selectlist.push(this.selectListModel)
  }
}

  onSubmit() {
    if (this.flagDefault && this.flagAddition) {
      this.issueActivity.issue_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(this.flagDefault && !this.flagAddition){
      this.getAdditionSelect(this.additional);
      this.issueActivity.issue_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(!this.flagDefault && this.flagAddition){
      this.getDefaultSelect(this.default);
      this.issueActivity.issue_details = this.default_selectlist.concat(this.additional_selectlist) 
    }
    this.issueActivity.contents=$('.note-editable').html();
    this.crmActivityIssueService.insertActivityIssue(this.issueActivity).then(data =>{
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit('issue');
      }
   })
  }
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmActivityIssueService.resetModel();
    this.issueActivity = this.crmActivityIssueService.getModel();
      this.issueActivity.issue_ymd = new Date().toISOString().split('T')[0];
      this.issueActivity.company_id = this.companyId;
      this.issueActivity.input_func_id = this.inputFuncId;
      this.issueActivity.func_ref_id = this.funcRefCd;
  }
 
onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmActivityIssueService.DeleteActivityIssue(this.issueActivity).then(data =>{
          if (!data.success) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.childCall.emit('issue');
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

