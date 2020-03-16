import { Component, OnInit, ViewChild } from '@angular/core';
import { SmartTableDatepickerRenderComponent, SmartTableDatepickerComponent } from './smart-table-datepicker.component';
import { HrMasOvertimeTableModel, HrOvertimeTableDetailModel } from '@app/core/models/hr/hr-overtime-table.model';
import { NotificationService } from '@app/core/services/notification.service';
import { HrOvertimeTableService } from '@app/core/services/hr.services/hr-overtime-table.service';
import { AuthService } from '@app/core/services/auth.service';
import { BasePage } from '@app/core/common/base-page';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomRenderSmartTableInputComponent } from './smart-table-input.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProgramService } from '@app/core/services';

@Component({
  selector: 'sa-overtime-table',
  templateUrl: './overtime-table.component.html',

  styleUrls: ['../../../../assets/css/smart-table.scss', "./overtime-table.component.css"],
  entryComponents: [
    SmartTableDatepickerRenderComponent, SmartTableDatepickerComponent, CustomRenderSmartTableInputComponent
  ]
})
export class HrOvertimeTableComponent extends BasePage implements OnInit {
  @ViewChild("popupOvertime") popupOvertime;
  userLogin: any;
  companyId: number = 0;
  select_ot_table_id: number = 0;
  workDayTypes: any[] = [];
  settings: object = {};
  listDayType: any = [];
  overtimes: HrOvertimeTableDetailModel[] = []
  source: LocalDataSource;
  modalRef: BsModalRef;
  overtimeTableInfo: HrMasOvertimeTableModel;
  overtimeTable: HrMasOvertimeTableModel[] = [];
  isOTTableExisted = false;
  maxTableId: number = 0;
  totalOtDetailRows: number = 0;
  selectedInterval: number = 1;
  // selectedStartValue:number=0;
  selectedStartWorking: string = '';
  selectedDayTypeGenCd = '';
  overtimeTableRemove: any[] = [];
  isUpdate:boolean = false;
  detailOTdayTypeGenCd;
  constructor(
    private notification: NotificationService,
    private hrOvertimeTableService: HrOvertimeTableService,
    public userService: AuthService,
    private generalMasterService: GeneralMasterService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    public programService: ProgramService,
    private _sanitizer: DomSanitizer
  ) {
    super(userService);
  }

  initModel() {
    this.companyId = this.userLogin.company_id;
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Overtime_Table.valueOf());
    this.userLogin = this.userService.getUserInfo();
    this.initModel();
    this.getDayType().then(data => {
      this.workDayTypes.push(...data)
      for (let i = 0; i < this.workDayTypes.length; i++) {
        if (i == 0) {
          this.selectedDayTypeGenCd = this.workDayTypes[i].gen_cd;
        }
        this.listDayType.push({ value: this.workDayTypes[i].gen_cd, title: this.workDayTypes[i].gen_nm });
      }
    });

    this.getListOvertimeTable().then(data => {
      this.overtimeTable=data;
      
      if (data.length > 0) {
        let _o = data[0];
        this.maxTableId = _o.ot_table_id;
        this.select_ot_table_id = this.maxTableId;
        this.selectedStartWorking = _o.start_working_time;
        //this.overtimeTableInfo=_o;
        this.getOvertimeDataTableDetail(_o.ot_table_id);
      }
    });
    this.initTable(this.listDayType)

  }


  initTable(dayType) {
    var freeYn = [{ value: true, title: 'Yes' }, { value: false, title: 'No' }]
    this.settings = {
      actions: {
        position: 'right',
        add: true
      },
      delete: {
        confirmDelete: true,
      },
      add: {
        confirmCreate: true,
      },
      edit: {
        confirmSave: true,
      },
      columns: {
        index: {
          title: this.i18nService.getTranslation('SV_ITEM_LIST_TABLE_INDEX'),
          class: 'center',
          type: 'html',
          editable: false,
          filter: false,
          addable: false,
          width: '20px'
        },
        work_day_type_gen_cd: {
          title: this.i18nService.getTranslation('DAYTYPE'),
          type: 'string',
          defaultValue: this.selectedDayTypeGenCd,
          width: '200px',
          filter: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: dayType,
            },
          },
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: dayType,
              //change:this.onDaytypeChange()
            },
          },
          valuePrepareFunction: (cell, row) => { return row.gen_nm }
        },
        start_working_time: {
          title: this.i18nService.getTranslation('OT_START_WORK_TIME'),
          type: 'string',
          class: 'center',
          editable: false,
          addable: false,
          defaultValue: this.selectedStartWorking,
          //defaultValue: '0.00',
          //editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
        },
        ref_working_time: {
          title: this.i18nService.getTranslation('OT_REF_WORKING_TO'),
          type: 'string',
          //defaultValue: this.getWorkingTimesValue(),
          //defaultValue: '0.00',
          //editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          //valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        free_time_yn: {
          title: this.i18nService.getTranslation('OT_FREE_TIME_YN'),
          type: 'html',
          width: '80px',
          defaultValue: '0',
          valuePrepareFunction: (value) => {
            let cbkHtml = value == "1" ? '<input type="checkbox" checked></input>' : '<input type="checkbox" ></input>';
            return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          },
          editor: {
            type: 'list',
            config: {
              selectText: 'No',
              list: freeYn,
            },
          },
        },
        ot_sum_hour: {
          title: this.i18nService.getTranslation('OT_WORKING_TIME'),
          type: 'string',
          //defaultValue: this.getWorkingTimesValue(),
          defaultValue: '0.00',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        ot_basic_hour: {
          title: this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          defaultValue: '0.00',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        ot_1_hour: {
          title: this.i18nService.getTranslation('OT-1') + ' T1',
          type: 'string',
          defaultValue: '0.00',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        ot_2_hour: {
          title: this.i18nService.getTranslation('OT-2') + ' T2',
          type: 'string',
          defaultValue: '0.00',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        ot_3_hour: {
          title: this.i18nService.getTranslation('OT-3') + ' T3',
          type: 'string',
          defaultValue: '0.00',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        ot_4_hour: {
          title: this.i18nService.getTranslation('OT-4') + ' T4',
          type: 'string',
          defaultValue: '0.00',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return parseFloat(value).toFixed(2) }
        },
        ot_nor_pay1: {
          title: this.i18nService.getTranslation('OT_NORMAL_PAY_1'),
          type: 'string',
          defaultValue: '0',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") }
        },
        ot_nor_pay2: {
          title: this.i18nService.getTranslation('OT_NORMAL_PAY_2'),
          type: 'string',
          defaultValue: '0',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") }
        },
        ot_ovw_pay1: {
          title: this.i18nService.getTranslation('OT_OVERTIME_PAY_1'),
          type: 'string',
          defaultValue: '0',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") }
        },
        ot_ovw_pay2: {
          title: this.i18nService.getTranslation('OT_OVERTIME_PAY_2'),
          type: 'string',
          defaultValue: '0',
          editor: { type: 'custom', component: CustomRenderSmartTableInputComponent },
          valuePrepareFunction: (value: any) => { return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") }
        },
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered'
      }
    };
  }
  onDaytypeChange() {
    //this.selectedDayTypeGenCd
  }
  getWorkingTimesValue() {
    if (this.overtimes.length == 0) {
      //first row insert, set start-value
      return '0.00';
    }
    else {
      //get max in daytype
      return this.getMaxWorktime()
    }
  }
  getMaxWorktime() {
    var f = this.overtimes.filter(x => x.work_day_type_gen_cd == this.selectedDayTypeGenCd);
    //console.log('max',f)
    if (f) {
      return Number(f[f.length - 1].ot_sum_hour) + 0.5;
    }
    else {
      return 0.00
    }

  }
  getListOvertimeTable() {
    return this.hrOvertimeTableService.listOverTimeTable(this.companyId);
  }


  getDayType() {

    return this.generalMasterService.listGeneralByCate(Category.WorkDayType.valueOf())
  }

  getListOvertimeTableDetail(ot_table_id: any = '') {
    return this.hrOvertimeTableService.ListOvertimeDetail(this.userLogin.company_id, ot_table_id)
  }

  getOvertimeTableInfo(ot_table_id: any = '') {
    return this.hrOvertimeTableService.GetOvertimeTableInfo(this.companyId, ot_table_id)
  }

  insertGenName() {
    for (var i = 0; i < this.overtimes.length; i++) {
      let t = this.listDayType.filter(x => x.value == this.overtimes[i].work_day_type_gen_cd);
      if (t.length) {
        this.overtimes[i].gen_nm = t[0].title;
      }
      this.overtimes[i].index = i+1;

      
      // for (var e = 0; e < this.listDayType.length; e++) {
      //   if (this.overtimes[i].work_day_type_gen_cd === this.listDayType[e].value) {
      //     this.overtimes[i].gen_nm = this.listDayType[e].title
      //     this.overtimes[i].index = this.listDayType.indexOf(this.listDayType[e]) + 1;
      //   }
      // }
    }
    this.initTable(this.listDayType)
  }

  getOvertimeDataTableDetail(otTableId) {
    this.getListOvertimeTableDetail(otTableId).then(data => {
      this.notification.hideCenterLoading();
      this.overtimes = data;
      this.totalOtDetailRows = this.overtimes.length;
      
      if(this.overtimes && this.overtimes.length>0){
        this.detailOTdayTypeGenCd=this.overtimes[0].work_day_type_gen_cd;
        //console.log('detailOTdayTypeGenCd',this.detailOTdayTypeGenCd)
      }

      this.insertGenName();
      return;
    });
    //this.insertGenName();
  }

  onCreateConfirm(event) {
    let _obj = event.newData;
    _obj.ot_table_id = this.select_ot_table_id;
    _obj.company_id = this.userLogin.company_id;

    this.hrOvertimeTableService.InsertOvertimeDetail(_obj).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        event.newData.trans_seq = data.data.trans_seq;
        event.newData.creator = data.data.creator;
        event.newData.changer = data.data.changer;
        event.newData.created_time = data.data.created_time;
        event.newData.changed_time = data.data.changed_time;
        event.confirm.resolve(event.newData);
        setTimeout(() => {
          this.getOvertimeDataTableDetail(this.select_ot_table_id)

        }, 100);
        this.notification.showMessage("success", data.message);
      }
    })
  }

  onSaveConfirm(event) {
    if (!this.permission.canSave) {
      this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
      return;
    }
    let _obj = event.newData;
    this.hrOvertimeTableService.InsertOvertimeDetail(_obj).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        event.confirm.resolve(event.newData);
        setTimeout(() => {
          this.getOvertimeDataTableDetail(_obj.ot_table_id)
        }, 100);
        this.notification.showMessage("success", data.message);
      }
    })
  }

  onDeleteConfirm(event) {
    if (!this.permission.canDelete) {
      this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
      return;
    }
    let _obj = event.data;
    this.notification.confirmDialog(
      "Delete Overtime Confirmation!",
      `Are you sure to delete this record?`,
      x => {
        if (x) {
          this.hrOvertimeTableService.DeleteOvertimeDetail(_obj).then(data => {
            if (data.error) {
              event.confirm.reject();
              this.notification.showMessage("error", data.error.message);
            } else {
              event.confirm.resolve(event.data);
              setTimeout(() => {
                this.overtimes = event.source.data;
                this.getOvertimeDataTableDetail(_obj.ot_table_id);
              }, 100);
              this.notification.showMessage("success", data.message);
            }
          })
        }
      }
    );
  }

  showCreateOverTimeTable() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.overtimeTableInfo = new HrMasOvertimeTableModel();
    this.overtimeTableInfo.ot_table_id=this.maxTableId+1;
    this.overtimeTableInfo.company_id = this.companyInfo.company_id;
    this.overtimeTableInfo.interval_minute=30;
    this.overtimeTableInfo.buffer_minute=5;
    this.isUpdate=false;
    this.modalRef = this.modalService.show(this.popupOvertime, config);
  }

  showUpdateOverTimeTable() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.overtimeTableInfo = new HrMasOvertimeTableModel();
    let _o = this.overtimeTable.filter(x => x.ot_table_id == this.select_ot_table_id);
    if(_o.length>0){
      this.overtimeTableInfo= _o[0];
    }
    this.overtimeTableInfo.work_day_type_gen_cd=this.detailOTdayTypeGenCd;
    this.isUpdate=true;
    this.modalRef = this.modalService.show(this.popupOvertime, config);
  }

  onOTIDChange() {
    
    var id = $("select[name='ot_table_id']").val();
    if(!id) return;
    console.log('onOTIDChange',id)
    this.select_ot_table_id = Number(id);
    console.log('onOTIDChange',this.overtimeTable)
    let _o = this.overtimeTable.filter(x => x.ot_table_id == id);
    if (_o) {
      console.log(_o)
      this.selectedStartWorking = _o[0].start_working_time;
    }
    this.notification.showCenterLoading();
    this.getOvertimeDataTableDetail(id);
  }

  closeOvertimePopup() {
    this.modalRef && this.modalRef.hide();
  }

  reloadNewOvertimeTable(info:any) {
    console.log('reloadNewOvertimeTable')
    if(this.isUpdate){
      //dont reload this.overtimeTable 
      console.log('isUpdate',this.selectedStartWorking,this.select_ot_table_id)
      //just reload detail
      this.getOvertimeDataTableDetail(this.select_ot_table_id);
    }
    else{
      //case insert new OT->reload->select #1
      this.getListOvertimeTable().then(data => {
        this.overtimeTable = data;
        if (this.overtimeTable.length > 0) {
          let _o = this.overtimeTable[0];
          this.maxTableId = _o.ot_table_id;
          this.select_ot_table_id = this.maxTableId;
          this.selectedStartWorking = _o.start_working_time;
          this.getOvertimeDataTableDetail(this.select_ot_table_id);
        }
      });
    }
    this.modalRef && this.modalRef.hide();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
