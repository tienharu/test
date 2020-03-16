import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';

import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { NotificationService, AuthService, UserMasterService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { WorkCalendarModel, WorkCalendarDayModel } from '@app/core/models/work-calendar.model';
import { WorkCalendarService } from '@app/core/services/features.services/work-calendar.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { I18nService } from '@app/shared/i18n/i18n.service'
import { CommonFunction } from '@app/core/common/common-function';
import 'datejs';

@Component({
  selector: 'sa-work-calendar',
  templateUrl: './work-calendar.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss', './work-calendar.component.css'],
})

export class WorkCalendarComponent extends BasePage implements OnInit {
  factorys: any;
  monthsYear: any = [];
  factoryId: number;
  isSaturdayHoliday: boolean = false;
  model: WorkCalendarModel;
  settings: object = {};
  workDayTypes: any = [];
  isDisable: boolean = true;
  isShow: boolean = false;
  modalRef: BsModalRef;

  @ViewChild("popupFactory") popupFactory;

  constructor(
    public i18n:I18nService,
    private notification: NotificationService,
    private workCalendarService: WorkCalendarService,
    public userService: AuthService,
    public userMasterService: UserMasterService,
    private orgService: OrganizationMasterService,
    private modalService: BsModalService,
    public programService: ProgramService,
    private generalMasterService: GeneralMasterService) {
    super(userService);
    this.model = new WorkCalendarModel();
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Work_Calendar.valueOf());
    this.orgService.listFactory(this.companyInfo.company_id).then(d => {
      this.factorys = d;
    });
    this.monthsYear = CommonFunction.loadYearMonths();
    this.initTable([]);
    this.generalMasterService.listGeneralByCate(Category.WorkDayType.valueOf()).then(data => {
      let dayType: any = [];
      data.forEach(element => {
        dayType.push({
          value: element.gen_nm,
          title: element.gen_nm
        });
      });
      this.workDayTypes.push(...data);
      this.initTable(dayType);
    });
  }

  initTable(dayType) {
    this.settings = {
      edit: {
        confirmSave: true,
        editButtonContent: this.i18n.getTranslation('EDIT'),
        saveButtonContent: this.i18n.getTranslation('BUTTON-SAVE'),
        cancelButtonContent:  this.i18n.getTranslation('CANCEL')
      },
      columns: {
        day: {
          type: 'html',
          title: this.i18n.getTranslation('DATE'),
          valuePrepareFunction(cell, row) {
            return '<div class="left">' + cell + '</div>';
          },
          editable: false,
          filter: true,
          width: "5%"
        },
        day_of_week_nm: {
          type: 'html',
          valuePrepareFunction(cell, row) {
            return '<div class="left">' + cell + '</div>';
          },
          title: this.i18n.getTranslation('WEEKDAY'),
          editable: false,
          filter: true,
          width: "10%",
        },
        work_day_type: {
          type: 'html',
          valuePrepareFunction(cell, row) {
            return '<div class="left">' + cell + '</div>';
          },
          title: this.i18n.getTranslation('DAYTYPE'),
          filter: true,
          width: "10%",
          editor: {
            type: 'list',
            config: {
              list: dayType,
            },
          }
        },
        work_yn: {
          type: 'bool',
          title: this.i18n.getTranslation('HOLIDAYKIND'),
          filter: true,
          filterFunction(cell, search) {
            if (cell) {
              return "Working Day".toLowerCase().includes(search.toString().toLowerCase())
            }
            else {
              return "Holiday".toLowerCase().includes(search.toString().toLowerCase())
            }
          },
          width: "10%",
          valuePrepareFunction: (value) => {
            return value === true || value === "true" ? 'Working Day' : 'Off Day'
          },
          editor: {
            type: 'list',
            config: {
              list: [
                { value: true, title: 'Working Day' },
                { value: false, title: 'Off Day' }
              ],
            },
          }
        },
        payment_yn: {
          type: 'bool',
          title: this.i18n.getTranslation('WORK_CALENDAR_PAYMENT'),
          filter: true,
          filterFunction(cell, search) {
            if (cell) {
              return "Payment".toLowerCase().includes(search.toString().toLowerCase())
            }
            else {
              return "No Payment".toLowerCase().includes(search.toString().toLowerCase())
            }
          },
          width: "10%",
          valuePrepareFunction: (value) => {
            return value === true || value === "true" ? 'Payment' : 'No Payment'
          },
          editor: {
            type: 'list',
            config: {
              list: [
                { value: true, title: 'Payment' },
                { value: false, title: 'No Payment' }
              ],
            },
          }
        },
        holiday_nm: {
          type: 'html',
          valuePrepareFunction(cell, row) {
            if (cell) {
              return '<div class="left">' + cell + '</div>';
            }
          },
          title: this.i18n.getTranslation('HOLIDAYNAME'),
          filter: true,
          width: "55%"
        }
      },
      actions: {
        columnTitle: this.i18n.getTranslation('ACTION'),
        add: false,
        edit: true,
        delete: false,
        position: 'right'
      },
      pager: {
        display: false
      },
      attr: {
        class: 'table-bordered'
      },
      noDataMessage: this.i18n.getTranslation('SEMPTYTABLE')
    };
  }

  onSaveConfirm(event) {
    if(!this.permission.canSave){
      this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
      return;
    }
    this.model.days.forEach(element => {
      if (element.day == event.newData.day) {
        element.work_yn = event.newData.work_yn;
        element.holiday_nm = event.newData.holiday_nm;
        element.payment_yn = event.newData.payment_yn;
        this.workDayTypes.filter(
          function (item) {
            if (item.gen_nm == event.newData.work_day_type) {
              element.work_day_type_gencd = item.gen_cd;
              element.work_day_type = item.gen_nm;
              return;
            }
          });
      }
    });
    this.workCalendarService.saveWorkCalendar(this.model).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", this.i18n.getTranslation('WORK_CALENDAR_MSG_SAVE_SUCCESSFUL'));
        if (data.data) {
          this.model = data.data;
        }
        else {
          this.model.days = [];
        }
      }
    });
    event.confirm.resolve(event.newData);
  }

  createCalendar() {
    if(!this.permission.canSave){
      this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
      return;
    }
    if (this.factoryId && this.model.year && this.model.month) {
      this.model.company_id = this.companyInfo.company_id;
      this.model.factory_id = this.factoryId;
      this.model.is_holiday_saturday = this.isSaturdayHoliday;
      this.model.days = WorkCalendarDayModel[0];
      this.workCalendarService.saveWorkCalendar(this.model).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
          this.model.days = [];
        } else {
          this.notification.showMessage("success", this.i18n.getTranslation('WORK_CALENDAR_MSG_SAVE_SUCCESSFUL'));
          if (data.data) {
            this.model = data.data;
            this.isDisable = true;
            this.isShow = true;
          }
          else {
            this.model.days = [];
            this.isDisable = false;
            this.isShow = false;
          }
        }
      });
    }
    else {
      this.notification.showMessage("error", this.i18n.getTranslation('WORK_CALENDAR_MSG_PLACE_MONTH_REQUIRED'));
    }
  }

  getCalendar(value) {
    let date = new Date(value);
    this.model.month = date.getMonth() + 1;
    this.model.year = date.getFullYear();
    this.loadWorkCalendar();
  }

  getFactory(value) {
    this.factoryId = value;
    this.loadWorkCalendar();
  }

  loadWorkCalendar() {
    if (this.factoryId && this.model.month) {
      this.workCalendarService.getWorkCalendar(this.companyInfo.company_id, this.factoryId, this.model.year, this.model.month).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          if (data.data.result && data.data.result.days.length>0) {
            this.model = data.data.result;
            this.isDisable = true;
            this.isShow = true;
          }
          else {
            this.model.days = [];
            this.isDisable = false;
            this.isShow = false;
          }
        }
      });
    }
    else {
      this.isDisable = false;
      this.isShow = false;
    }
  }

  showFactoryPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.modalRef = this.modalService.show(this.popupFactory, config);
  }

  closeFactoryPopup() {
    this.modalRef && this.modalRef.hide();
  }

  copyWorkCalendar() {
    if(!this.permission.canSave){
      this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
      return;
    }
    this.model.factorys = [];
    this.factorys.forEach((item, index) => {
      if (item.factory_id != this.factoryId && item.selected) {
        this.model.factorys.push(item.factory_id);
      }
      item.selected = false;
    });
    this.closeFactoryPopup();
    this.workCalendarService.copyWorkCalendar(this.model).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", this.i18n.getTranslation('WORK_CALENDAR_MSG_SAVE_SUCCESSFUL'));
      }
    });
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}