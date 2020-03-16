import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import {
  NotificationService,
  AuthService,
  OrganizationMasterService
} from "@app/core/services";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { OrganizationModel } from "@app/core/models/organization.model";
import { AttendanceService } from "@app/core/services/hr.services/hr-attendance.service";
import { CommonFunction } from "@app/core/common/common-function";
import { TimeSpan } from "@app/shared/utils/timepan";
import { ProgramService } from '@app/core/services';

@Component({
  selector: "hr-daily-attendance",
  templateUrl: "./daily-attendance.component.html",
  styleUrls: ["./daily-attendance.component.css"]
})
export class DailyAttendanceComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  departments: OrganizationModel[] = [];
  orgid: number = 0;
  calendar: Date;
  from_record: number = 0;
  to_record: number = 0;
  page: number = 1;
  pageSize: number = 25;
  totalItems: number = 0;
  employees: any[] = [];
  hrid: string = "";
  attendanceLogs: any = [];
  attendancePayments: any = [];
  specialAttendanceLogs: any = [];
  iswithoutinout: boolean = false;
  isWarning: boolean = false;
  mode: number = 1;
  vacation: string = "";
  setting: any = {
    in_time: "",
    out_time: "",
    reset_name: "",
    description: ""
  };
  isShowSetting: boolean = false;
  diff: TimeSpan;
  labels: any = {
    previousLabel: this.i18n.getTranslation("SPREVIOUS"),
    nextLabel: this.i18n.getTranslation("SNEXT")
  };

  @ViewChild("popupSetting") popupSetting;
  @ViewChild("frmDetail") frmDetail: ElementRef;

  constructor(
    public i18n: I18nService,
    private notification: NotificationService,
    private modalService: BsModalService,
    public userService: AuthService,
    public programService: ProgramService,
    public organizationMasterService: OrganizationMasterService,
    public dailyAttendanceService: AttendanceService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.organizationMasterService
      .listOrganization(this.companyInfo.company_id)
      .then(d => {
        this.departments = d;
      });
    this.dailyAttendanceService.getAttendanceLog().then(d => {
      this.attendanceLogs = d.data;
      this.specialAttendanceLogs = this.attendanceLogs.filter(function(data) {
        return data.category == "4";
      });
      this.attendancePayments= this.attendanceLogs;
    });
    this.displayRecord();
  }

  hideSetting() {
    this.isShowSetting = false;
  }

  reset() {
    this.employees = [];
    this.page = 1;
    this.totalItems = 0;
    this.hrid = "";
  }

  displayRecord() {
    var totalPage = Math.ceil(this.totalItems / this.pageSize);
    if (this.totalItems < this.pageSize && this.totalItems > 0) {
      this.from_record = 1;
      this.to_record = this.totalItems;
    } else if (this.page == totalPage) {
      this.from_record = this.pageSize * (this.page - 1) + 1;
      this.to_record = this.totalItems;
    } else if (this.totalItems > 0) {
      if (this.page == 1) {
        this.from_record = 1;
        this.to_record = this.pageSize;
      } else {
        this.from_record = this.pageSize * (this.page - 1) + 1;
        this.to_record = this.from_record + this.pageSize - 1;
      }
    } else {
      this.from_record = 0;
      this.to_record = 0;
    }
  }

  createAttendance() {
    if (this.calendar) {
      let date = new Date(this.calendar);
      this.notification.showCenterLoading();
      this.dailyAttendanceService
        .createEmployeeAttendance(
          this.orgid,
          this.hrid,
          this.mode,
          this.vacation,
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          this.pageSize
        )
        .then(data => {
          if (data.error) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.page = 1;
            this.notification.showMessage(
              "success",
              this.i18n.getTranslation("DAILYATTEND_MSG_SAVE_SUCCESSUL")
            );
            this.searchAttendance(true);
            // if (data.data) {
            //   this.employees = data.data;
            //   this.totalItems = data.total;
            //   this.isShowSetting = true;
            //   this.displayRecord();
            // } else {
            //   this.reset();
            // }
          }
          this.notification.hideCenterLoading();
        });
    } else {
      this.notification.showMessage(
        "error",
        this.i18n.getTranslation("DAILYATTEND_MSG_DATE_REQUIRED")
      );
    }
  }

  saveChange() {
    this.notification.showCenterLoading();
    this.dailyAttendanceService
      .saveEmployeeAttendance(this.mode,this.vacation, this.employees)
      .then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.searchAttendance(true);
          this.notification.showMessage(
            "success",
            this.i18n.getTranslation("DAILYATTEND_MSG_SAVE_SUCCESSUL")
          );
          this.notification.hideCenterLoading();
        }
      });
  }

  searchAttendance(isChange) {
    if (this.calendar) {
      if (!isChange) this.page = 1;
      let date = new Date(this.calendar);
      this.notification.showCenterLoading();
      this.dailyAttendanceService
        .getAttendanceEmployees(
          this.orgid,
          this.hrid,
          this.vacation,
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          this.iswithoutinout,
          this.isWarning,
          this.pageSize,
          this.page
        )
        .then(data => {
          this.notification.hideCenterLoading();
          if(data.error){
            this.notification.showMessage("error", data.error.message);
            return;
          }
          if (data.data) {
            this.employees = data.data;
            this.totalItems = data.total;
            this.isShowSetting = true;
            this.displayRecord();
          } else {
            this.reset();
          }
          
        });
    } else {
      this.notification.showMessage(
        "error",
        this.i18n.getTranslation("DAILYATTEND_MSG_DATE_REQUIRED")
      );
    }
  }

  changePage(page) {
    this.page = page;
    this.searchAttendance(true);
  }

  showSettingPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.dailyAttendanceService.getSetting().then(data => {
      if (data.data) {
        this.setting = data.data;
      } else {
        this.setting = {
          in_time: "",
          out_time: "",
          reset_name: "",
          description: ""
        };
      }
    });
    this.modalRef = this.modalService.show(this.popupSetting, config);
  }

  saveSetting() {
    if (
      this.setting &&
      this.setting.reset_name &&
      ((this.setting.in_time && this.setting.in_time != "") ||
        (this.setting.out_time && this.setting.out_time != ""))
    ) {
      var in_time = Date.parse(
        new Date().toString("M/d/yyyy") + " " + this.setting.in_time
      );
      var out_time = Date.parse(
        new Date().toString("M/d/yyyy") + " " + this.setting.out_time
      );
      this.setting.in_time =
        CommonFunction.pad2(in_time.getHours()) +
        ":" +
        CommonFunction.pad2(in_time.getMinutes());
      this.setting.out_time =
        CommonFunction.pad2(out_time.getHours()) +
        ":" +
        CommonFunction.pad2(out_time.getMinutes());
      this.setting.reset_type = 1;
      this.dailyAttendanceService.saveSetting(this.setting).then(data => {
        if (data.success) {
          this.createAttendance();
          this.closeFactoryPopup();
        } else {
          this.notification.showMessage("error", data.message);
        }
      });
    } else {
      this.notification.showMessage(
        "error",
        this.i18n.getTranslation("DAILYATTEND_MSG_TIME_NAME_REQUIRED")
      );
    }
  }

  deleteSetting() {
    let date = new Date(this.calendar);
    this.dailyAttendanceService
      .deleteSetting(
        this.setting.reset_id,
        this.employees
      )
      .then(data => {
        if (data.success) {
          this.notification.showMessage(
            "success",
            this.i18n.getTranslation("DAILYATTEND_MSG_DELETE_SUCCESSFUL")
          );
          this.searchAttendance(false);
          this.setting = {};
          this.closeFactoryPopup();
        } else {
          this.notification.showMessage("error", data.message);
        }
      });
  }

  closeFactoryPopup() {
    this.modalRef && this.modalRef.hide();
  }

  editTime(element, row, flag) {
    var cellElement = $(element.target);
    cellElement.text("");
    if (flag == 1) {
      cellElement.append(
        `<input type="time" style="background-color:white;border: #9eafb9 solid 1px;text-align:right;width:100%;padding:0px" class="input-edit" value="${
          row.in_time
        }"/>`
      );
    } else if (flag == 2) {
      cellElement.append(
        `<input type="time" style="background-color:white;border: #9eafb9 solid 1px;text-align:right;width:100%;padding:0px" class="input-edit" value="${
          row.out_time
        }" />`
      );
    }
    cellElement.find(".input-edit").focus();
    cellElement.find(".input-edit").focusout(function(e) {
      e.target.replaceWith(e.currentTarget.value);
      if (flag == 1) {
        if(row.in_time != e.currentTarget.value)
        {
          row.edit_yn = true;
        }
        row.in_time = e.currentTarget.value;
      } else if (flag == 2) {
        if(row.out_time != e.currentTarget.value)
        {
          row.edit_yn = true;
        }
        row.out_time = e.currentTarget.value;
      }
    });
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
  excelExport(){
    if (this.calendar) {
      let date = new Date(this.calendar);
      this.notification.showCenterLoading();
      this.dailyAttendanceService.dailyAttendanceToExcel(this.orgid,
        this.hrid,
        this.vacation,
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        this.iswithoutinout,
        this.isWarning).then(res=>{
          this.notification.hideCenterLoading();
      });
    }
    else{
      this.notification.showMessage(
        "error",
        this.i18n.getTranslation("DAILYATTEND_MSG_DATE_REQUIRED")
      );
    }
  }

  logStartChanges(e,empl) { 
    empl.finish_gen_cd =e; 
  }

  
}
