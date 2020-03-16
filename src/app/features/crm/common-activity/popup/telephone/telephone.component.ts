import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService, UserMasterService } from '@app/core/services';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CrmActivityTelModel, crmActivityTelDetailModel } from '@app/core/models/crm/activity-tel.model';
import { CrmActivityTelService } from '@app/core/services/crm/customer-detail.service';

@Component({
  selector: 'sa-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['../../common-activity.css']
})
export class TelephoneComponent implements OnInit {
  @Output() childCall = new EventEmitter();
  @Input() companyId: number;
  @Input() inputFuncId: number;
  @Input() funcRefCd: number;
  @Input() Id : number = 0;
  @Input() telJson : string;
  @Input() customer : string;
  @Input() contactor : string;
  @Input() user : string;
  telActivity : CrmActivityTelModel;

  modalRef: BsModalRef;
  default : any[] = [];
  additional : any[] = [];
  flagDefault :boolean = false;
  flagAddition :boolean = false;
  defaultContent :any;

  selectListModel : crmActivityTelDetailModel;

  default_selectlist : crmActivityTelDetailModel[] =[];
  additional_selectlist : crmActivityTelDetailModel[] =[];
  constructor(
    private notification: NotificationService,
    private crmActivityTelService : CrmActivityTelService,
    private traderService :TraderService,
    private contactorService : ContactorService,
    private userMasterService : UserMasterService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    $('.tel-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.telActivity.tel_ymd=selectedDate;
      }
    });
    this.customer=JSON.parse(this.customer);
    this.contactor=JSON.parse(this.contactor);
    this.user=JSON.parse(this.user);
    this.crmActivityTelService.resetModel();
    this.telActivity = this.crmActivityTelService.getModel();
    if (this.Id == 0) {
      setTimeout(() => {
        this.telActivity.tel_title_type = 2;
      }, 100);
    this.telActivity.tel_ymd = new Date().toISOString().split('T')[0];
    this.telActivity.company_id = this.companyId;
    this.telActivity.input_func_id = this.inputFuncId;
    this.telActivity.func_ref_id = this.funcRefCd;
    }else{
      this.getDataForUpdate();
      if (JSON.parse(this.telJson).contents) {
        this.defaultContent = JSON.parse(this.telJson).contents
        }
    }
  }

  getDataForUpdate(){
    this.crmActivityTelService.getTelDetail(this.companyId, this.inputFuncId, this.funcRefCd,this.Id).then(data =>{
      this.telActivity = data;
      console.log(this.telActivity)
      this.telActivity.tel_details.forEach(element => {
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

getDefaultSelect(value) {
  this.flagDefault = true;
  this.default_selectlist = [];
  value.forEach(element => {
    this.selectListModel = new crmActivityTelDetailModel()
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
    this.selectListModel = new crmActivityTelDetailModel()
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
    tel_title_type: {
      required: true
    },
    title_nm: {
      required: true
    },
    tel_ymd: {
      required: true
    },
    contents: {
      required: true
    }
  },
  // Messages for form validation
  messages: {
    tel_title_type: {
      required: "Please select"
    },
    title_nm: {
      required: "Please enter"
    },
    tel_ymd: {
      required: "Please select"
    },
    contents: {
      required: "Please enter"
    }
  }
};
  onSubmit() {
    // this.telActivity.tel_details = this.default_selectlist.concat(this.additional_selectlist)
    if (this.flagDefault && this.flagAddition) {
      this.telActivity.tel_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(this.flagDefault && !this.flagAddition){
      this.getAdditionSelect(this.additional);
      this.telActivity.tel_details = this.default_selectlist.concat(this.additional_selectlist) 
    }else if(!this.flagDefault && this.flagAddition){
      this.getDefaultSelect(this.default);
      this.telActivity.tel_details = this.default_selectlist.concat(this.additional_selectlist) 
    }
    this.telActivity.contents=$('.note-editable').html();
    this.crmActivityTelService.insertActivityTel(this.telActivity).then(data =>{
      if (!data.success) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit('tel');
      }
   }) 
  }
  onReset(){
    $("form.frm-detail")
    .validate()
    .resetForm();
    this.crmActivityTelService.resetModel();
    this.telActivity = this.crmActivityTelService.getModel();
    this.telActivity.tel_title_type = 2;
    this.telActivity.tel_ymd = new Date().toISOString().split('T')[0];
    this.telActivity.company_id = this.companyId;
    this.telActivity.input_func_id = this.inputFuncId;
    this.telActivity.func_ref_id = this.funcRefCd;
  }

onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.crmActivityTelService.DeleteActivityTel(this.telActivity).then(data =>{
          if (!data.success) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.childCall.emit('tel');
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
