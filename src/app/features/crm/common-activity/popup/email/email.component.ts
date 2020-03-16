import { NotificationService, UserMasterService } from '@app/core/services';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { CrmActivityEmailModel, crmActivityEmailDetailModel } from '@app/core/models/crm/activity-email.model';
import { CrmActivityEmailService } from '@app/core/services/crm/customer-detail.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'sa-email',
  templateUrl: './email.component.html',
  styleUrls: ['../../common-activity.css']
})
export class EmailComponent implements OnInit {
  @Output() childCall = new EventEmitter();
  @Input() companyId: number;
  @Input() inputFuncId: number;
  @Input() funcRefCd: number;
  @Input() Id : number = 0;
  @Input() emailJson : string;
  @Input() customer : string;
  @Input() contactor : string;
  @Input() user : string;
  
  emailActivity : CrmActivityEmailModel;
  // customer:any[] = [];
  // contactor:any[] = [];
  // user:any[] = [];
  modalRef: BsModalRef;
  default : any[] = [];
  additional : any[] = [];
  flagDefault :boolean = false;
  flagAddition :boolean = false;
  defaultContent :any;
  
  selectListModel : crmActivityEmailDetailModel;

  default_selectlist : crmActivityEmailDetailModel[] =[];
  additional_selectlist : crmActivityEmailDetailModel[] =[];
  constructor(
    private notification: NotificationService,
    private crmActivityEmailService : CrmActivityEmailService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    $('.email-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.emailActivity.email_ymd=selectedDate;
      }
    });
    this.customer=JSON.parse(this.customer);
    this.contactor=JSON.parse(this.contactor);
    this.user=JSON.parse(this.user);

    this.crmActivityEmailService.resetModel();
    this.emailActivity = this.crmActivityEmailService.getModel();
    if (this.Id == 0) {
      setTimeout(() => {
        this.emailActivity.email_title_type = 2;
      }, 100);
      this.emailActivity.email_ymd = new Date().toISOString().split('T')[0];
      this.emailActivity.company_id = this.companyId;
      this.emailActivity.input_func_id = this.inputFuncId;
      this.emailActivity.func_ref_id = this.funcRefCd;
      this.defaultContent="";
    }else{
      this.getDataForUpdate();
      if (JSON.parse(this.emailJson).contents) {
        this.defaultContent = JSON.parse(this.emailJson).contents
        }
    }
  }

  getDataForUpdate(){
    this.crmActivityEmailService.getEmailDetail(this.companyId, this.inputFuncId, this.funcRefCd,this.Id).then(data =>{
      this.emailActivity = data;
          this.emailActivity.email_details.forEach(element => {
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
      email_title_type: {
        required: true
      },
      title_nm: {
        required: true
      },
      email_ymd: {
        required: true
      },
      contents: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      email_title_type: {
        required: "Please select"
      },
      title_nm: {
        required: "Please enter"
      },
      email_ymd: {
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
    this.selectListModel = new crmActivityEmailDetailModel()
    let info = element.split('-');
    this.selectListModel.company_id = this.companyId;
    this.selectListModel.input_func_id = this.inputFuncId;
    this.selectListModel.func_ref_id = this.funcRefCd;
    this.selectListModel.email_id =this.emailActivity.email_id;
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
    this.selectListModel = new crmActivityEmailDetailModel()
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
      this.emailActivity.email_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(this.flagDefault && !this.flagAddition){
      this.getAdditionSelect(this.additional);
      this.emailActivity.email_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(!this.flagDefault && this.flagAddition){
      this.getDefaultSelect(this.default);
      this.emailActivity.email_details = this.default_selectlist.concat(this.additional_selectlist) 
    }
    this.emailActivity.contents=$('.note-editable').html();
    this.crmActivityEmailService.insertActivityEmail(this.emailActivity).then(data =>{
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit('email');
      }
   })
  }
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmActivityEmailService.resetModel();
    this.emailActivity = this.crmActivityEmailService.getModel();
    this.emailActivity.email_title_type = 2;
      this.emailActivity.email_ymd = new Date().toISOString().split('T')[0];
      this.emailActivity.company_id = this.companyId;
      this.emailActivity.input_func_id = this.inputFuncId;
      this.emailActivity.func_ref_id = this.funcRefCd;
  }

onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmActivityEmailService.DeleteActivityEmail(this.emailActivity).then(data =>{
          if (!data.success) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.childCall.emit('email');
          }
        })
      }
    }
  );
}
onClose(){
  this.modalService.hide(1);
}
// changeContent(event){
//   this.emailActivity.contents = event;
// }
}
