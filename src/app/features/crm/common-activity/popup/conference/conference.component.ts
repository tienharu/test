import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { crmActivityMeetingDetailModel, CrmActivityMeetingModel, crmActivityMeetingPersonModel } from '@app/core/models/crm/activity-meeting.model';
import { NotificationService, UserMasterService } from '@app/core/services';
import { CrmActivityMeetingService } from '@app/core/services/crm/customer-detail.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';

@Component({
  selector: 'sa-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['../../common-activity.css']
})
export class ConferenceComponent implements OnInit {
  @Output() childCall = new EventEmitter();
  @Input() companyId: number;
  @Input() inputFuncId: number;
  @Input() funcRefCd: number;
  @Input() Id : number = 0;
  @Input() meetingJson : string;
  @Input() customer : string;
  @Input() contactor : string;
  @Input() user : string;

  meetingActivity : CrmActivityMeetingModel;
  meeting_ymd: any;
  
  modalRef: BsModalRef;
  default : any[] = [];
  additional : any[] = [];
  participant : any[] = [];
  flagDefault :boolean = false;
  flagAddition :boolean = false;
  flagParticipant :boolean = false;
  defaultContent :any;


  selectListModel : crmActivityMeetingDetailModel;
  selectPersonModel : crmActivityMeetingPersonModel;
  default_selectlist : crmActivityMeetingDetailModel[] =[];
  additional_selectlist : crmActivityMeetingDetailModel[] =[];
  participant_selectlist : crmActivityMeetingPersonModel[] =[];
  constructor(
    private notification: NotificationService,
    private crmActivityMeetingService : CrmActivityMeetingService,
    private traderService :TraderService,
    private contactorService : ContactorService,
    private userMasterService : UserMasterService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    $('.meeting-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.meetingActivity.meeting_ymd=selectedDate;
      }
    });
    this.customer=JSON.parse(this.customer);
    this.contactor=JSON.parse(this.contactor);
    this.user=JSON.parse(this.user);

    this.crmActivityMeetingService.resetModel();
    this.meetingActivity = this.crmActivityMeetingService.getModel();
    if (this.Id == 0) {
      this.meetingActivity.meeting_ymd = new Date().toISOString().split('T')[0];
    this.meetingActivity.company_id = this.companyId;
    this.meetingActivity.input_func_id = this.inputFuncId;
    this.meetingActivity.func_ref_id = this.funcRefCd;
    }else{
      this.getDataForUpdate();
      if (JSON.parse(this.meetingJson).contents) {
        this.defaultContent = JSON.parse(this.meetingJson).contents
        }
    }
  }

  getDataForUpdate(){
    this.crmActivityMeetingService.getMeetingDetail(this.companyId, this.inputFuncId, this.funcRefCd,this.Id).then(data =>{
      this.meetingActivity = data;
      this.meetingActivity.meeting_details.forEach(element => {
        if (element.default_yn == true) {
          let val = element.with_type+"-"+element.with_ref_id;
          this.default.push(val)
        }else{
          let val = element.with_type+"-"+element.with_ref_id+"-"+element.person_type;
          this.additional.push(val)
        }
      });
      this.meetingActivity.meeting_persons.forEach(element => {
        let val = element.person_id+"-"+element.person_type;
          this.participant.push(val)
      });
      setTimeout(() => {
        $("#default").val(this.default);
          $("#default").select2();
          $("#additional").val(this.additional);
          $("#additional").select2();
          $("#participant").val(this.participant);
          $("#participant").select2();
      }, 100);
    })
  }

getDefaultSelect(value) {
  this.flagDefault = true;
  this.default_selectlist = [];
  value.forEach(element => {
    this.selectListModel = new crmActivityMeetingDetailModel()
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
getParticipantSelect(value) {
  this.flagParticipant = true;
  this.participant_selectlist = [];
  value.forEach(element => {
    this.selectPersonModel = new crmActivityMeetingPersonModel()
    let info = element.split('-');
    this.selectPersonModel.company_id = this.companyId;
    this.selectPersonModel.input_func_id = this.inputFuncId;
    this.selectPersonModel.func_ref_id = this.funcRefCd;
    this.selectPersonModel.person_id = info[0];
    this.selectPersonModel.person_type = info[1];
    this.participant_selectlist.push(this.selectPersonModel)
  });
}
getAdditionSelect(value) {
  this.flagAddition = true;
  this.additional_selectlist = [];
  for (let item of value) {
    this.selectListModel = new crmActivityMeetingDetailModel()
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
validationOptions: any = {
  ignore: [], //enable hidden validate
  // Rules for form validation
  rules: {
    title_nm: {
      required: true
    },
    meeting_ymd: {
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
    meeting_ymd: {
      required: "Please select"
    },
    contents: {
      required: "Please enter"
    }
  }
};
  onSubmit() {
    if (this.flagDefault && this.flagAddition) {
      this.meetingActivity.meeting_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(this.flagDefault && !this.flagAddition){
      this.getAdditionSelect(this.additional);
      this.meetingActivity.meeting_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(!this.flagDefault && this.flagAddition){
      this.getDefaultSelect(this.default);
      this.meetingActivity.meeting_details = this.default_selectlist.concat(this.additional_selectlist) 
    }
    if (this.flagParticipant) {
      this.meetingActivity.meeting_persons = this.participant_selectlist;
    }else{
      this.getParticipantSelect(this.participant);
      this.meetingActivity.meeting_persons = this.participant_selectlist;
    }
    this.meetingActivity.contents=$('.note-editable').html();
    this.meetingActivity.meeting_persons = this.participant_selectlist;
    this.crmActivityMeetingService.insertActivityMeeting(this.meetingActivity).then(data =>{
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit('meeting');
      }
   })
  }
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmActivityMeetingService.resetModel();
    this.meetingActivity = this.crmActivityMeetingService.getModel();
    this.meetingActivity.meeting_ymd = new Date().toISOString().split('T')[0];
    this.meetingActivity.company_id = this.companyId;
    this.meetingActivity.input_func_id = this.inputFuncId;
    this.meetingActivity.func_ref_id = this.funcRefCd;
  }

 
onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmActivityMeetingService.DeleteActivityMeeting(this.meetingActivity).then(data =>{
          if (!data.success) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.childCall.emit('meeting');
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

