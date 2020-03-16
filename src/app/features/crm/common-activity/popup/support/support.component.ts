import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CrmProjectTaskModel, CrmProjectTaskPersonModel } from '@app/core/models/crm/activity-support.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NotificationService } from '@app/core/services';
import { CrmActivitySupportService } from '@app/core/services/crm/customer-detail.service';
import { TraderModel } from '@app/core/models/trader.model';
import { UserModel } from '@app/core/models/user.model';
import { ContactorModel } from '@app/core/models/contactor.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';

@Component({
  selector: 'sa-support',
  templateUrl: './support.component.html',
  styleUrls: ['../../common-activity.css']
})
export class SupportComponent implements OnInit {
  @Output() childCall = new EventEmitter();
  @Input() companyId: number;
  @Input() projectId: number;
  @Input() Id : number = 0;
  @Input() supportJson : string;
  @Input() Jscontactor : string;
  @Input() Jsuser : string;
  supportActivity : CrmProjectTaskModel;
  // true-{{item.user_id}}-true 'true' fisrt is user (false is contactor), 'true' second is worker_yn

  contactor:ContactorModel[] = [];
  taskType:any[]=[];
  workUnit:any[]=[];
  user:UserModel[] = [];
  modalRef: BsModalRef;
  worker : any[] = [];
  requester : any[] = [];
  flagWorker :boolean = false;
  flagRequester :boolean = false;
  defaultContent :any;
  
  selectListModel : CrmProjectTaskPersonModel;
  worker_selectlist : CrmProjectTaskPersonModel[] =[];
  requester_selectlist : CrmProjectTaskPersonModel[] =[];
  constructor(
    private notification: NotificationService,
    private crmActivitySupportService : CrmActivitySupportService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
  ) { }

  ngOnInit() {
    $('.support-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.supportActivity.start_ymd=selectedDate;
      }
    });
    this.getTaskType().then(data => {
      this.taskType.push(...data)
    })
    this.getWorkUnit().then(data => {
      this.workUnit.push(...data)
    })
    this.contactor=JSON.parse(this.Jscontactor);
    this.user=JSON.parse(this.Jsuser);
    this.crmActivitySupportService.resetModel();
    this.supportActivity = this.crmActivitySupportService.getModel();
    if (this.Id == 0) {
      this.supportActivity.start_ymd = new Date().toISOString().split('T')[0];
      this.supportActivity.company_id = this.companyId;
      this.supportActivity.project_id = this.projectId;
      this.defaultContent="";
    }else{
      this.getDataForUpdate();
      if (JSON.parse(this.supportJson).contents) {
        this.defaultContent = JSON.parse(this.supportJson).contents
        }
    }
  }
  getTaskType(){
    return this.generalMasterService.listGeneralByCate(Category.TaskType.valueOf())
  }
  getWorkUnit(){
    return this.generalMasterService.listGeneralByCate(Category.ItemUnit.valueOf())
  }
  getDataForUpdate(){
    this.crmActivitySupportService.getSupportDetail(this.companyId,this.Id).then(data =>{
      this.supportActivity = data;
          this.supportActivity.project_task_person.forEach(element => {
        if (element.worker_yn == true) {
          this.user.forEach(user => {
            if (user.user_id == element.person_id) {
              let val = 'true'+'-'+element.person_id+"-true";
              this.worker.push(val);
            }
          });
          this.contactor.forEach(con => {
            if (con.contactor_id == element.person_id) {
              let val = 'false'+'-'+element.person_id+"-true";
              this.worker.push(val);
            }
          });
        }else{
          this.requester.push(element.person_id);
        }
      });
      setTimeout(() => {
        $("#worker").val(this.worker);
          $("#worker").select2();
          $("#requester").val(this.requester);
          $("#requester").select2();
      }, 100);
    })
  }
  validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      support_title_type: {
        required: true
      },
      title_nm: {
        required: true
      },
      support_ymd: {
        required: true
      },
      contents: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      support_title_type: {
        required: "Please select"
      },
      title_nm: {
        required: "Please enter"
      },
      support_ymd: {
        required: "Please select"
      },
      contents: {
        required: "Please enter"
      }
    }
  };

getWorkerSelect(value) {
  this.flagWorker = true;
  this.worker_selectlist = [];
  for (let item of value) {
    this.selectListModel = new CrmProjectTaskPersonModel()
    let info = item.split('-');
    this.selectListModel.company_id = this.companyId;
    this.selectListModel.project_task_id = this.supportActivity.project_task_id;
    this.selectListModel.person_type = info[0]
    this.selectListModel.person_id = info[1];
    this.selectListModel.worker_yn = info[2]
    this.selectListModel.del_yn =false;
    this.worker_selectlist.push(this.selectListModel)
  }
}
getRequesterSelect(value) {
  this.flagRequester = true;
  this.requester_selectlist = [];
  for (let item of value) {
    this.selectListModel = new CrmProjectTaskPersonModel();
    let info = item.split('-');
    this.selectListModel.company_id = this.companyId;
    this.selectListModel.project_task_id = this.supportActivity.project_task_id;
    this.selectListModel.person_type = info[0]
    this.selectListModel.person_id = info[1];
    this.selectListModel.worker_yn = info[2]
    this.selectListModel.del_yn =false;
    this.requester_selectlist.push(this.selectListModel)
  }
}

  onSubmit() {
    if (this.flagWorker && this.flagRequester) {
      this.supportActivity.project_task_person = this.worker_selectlist.concat(this.requester_selectlist) 
    }else if(this.flagWorker && !this.flagRequester){
      this.getRequesterSelect(this.requester);
      this.supportActivity.project_task_person = this.worker_selectlist.concat(this.requester_selectlist) 
    }else if(!this.flagWorker && this.flagRequester){
      this.getWorkerSelect(this.worker);
      this.supportActivity.project_task_person = this.worker_selectlist.concat(this.requester_selectlist) 
    }
    this.supportActivity.contents=$('.note-editable').html();
    this.crmActivitySupportService.insertActivitySupport(this.supportActivity).then(data =>{
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit('support');
      }
   })
  console.log("array_worker_requester", this.supportActivity.project_task_person)
  }
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmActivitySupportService.resetModel();
    this.supportActivity = this.crmActivitySupportService.getModel();
      this.supportActivity.start_ymd = new Date().toISOString().split('T')[0];
      this.supportActivity.company_id = this.companyId;
      this.supportActivity.project_id = this.projectId;
  }

onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmActivitySupportService.DeleteActivitySupport(this.supportActivity).then(data =>{
          if (!data.success) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.childCall.emit('support');
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
