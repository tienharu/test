import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import {
  NotificationService,
  AuthService,
  OrganizationMasterService
} from "@app/core/services";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { AttendanceService } from "@app/core/services/hr.services/hr-attendance.service";
import { CommonFunction } from "@app/core/common/common-function";
import { ProgramService } from '@app/core/services';

@Component({
  selector: "hr-attendance-person",
  templateUrl: "./attendance-person.component.html",
  styleUrls: ["./attendance-person.component.css"]
})
export class AttendancePersonComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  employees: any[] = [];
  attendanceLogs: any = [];
  specialAttendanceLogs: any = [];
  hrid: string = "";
  department: string = "";
  from_record: number = 0;
  to_record: number = 0;
  page: number = 1;
  pageSize: number = 25;
  totalItems: number = 0;
  attendances: any[] = [];
  attendancePayments: any = [];
  employeeName: string = "";
  isShowSetting: boolean = false;
  startdate: string;
  finishdate: string;
  vacation: string = "";
  labels: any = {
    previousLabel: this.i18n.getTranslation("SPREVIOUS"),
    nextLabel: this.i18n.getTranslation("SNEXT")
  };
  setting: any = {
    in_time: "",
    out_time: "",
    reset_name: "",
    description: ""
  };
  editRow:any={};
  @ViewChild("popupSetting") popupSetting;
  @ViewChild("popupEditWorkingTime") popupEditWorkingTime;
  @ViewChild("frmDetail") frmDetail: ElementRef;

  constructor(
    public i18n: I18nService,
    private notification: NotificationService,
    private modalService: BsModalService,
    public userService: AuthService,
    public programService: ProgramService,
    public organizationMasterService: OrganizationMasterService,
    public attendanceByPersonService: AttendanceService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.attendanceByPersonService.getEmployees().then(d => {
      this.employees = d.data;
    });
    this.attendanceByPersonService.getAttendanceLog().then(d => {
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
    this.attendances = [];
    this.page = 1;
    this.totalItems = 0;
    this.employeeName = "";
  }

  searchAttendance(isChange) {
    var self = this;
    self.employees.filter(function(e) {
      if (e.hr_id == self.hrid) {
        self.department = e.department;
        self.employeeName = e.employee_name;
      }
    });
    if (self.startdate && self.finishdate) {
      if (!isChange) self.page = 1;
      let model = {
        hrid: self.hrid,
        from_date: new Date(self.startdate).toJSON(),
        to_date: new Date(self.finishdate).toJSON(),
        vacation: this.vacation,
        page_size: self.pageSize,
        page: self.page
      };
      self.notification.showCenterLoading();
      self.attendanceByPersonService.getAttendanceByPerson(model).then(data => {
        if (data.data) {
          self.attendances = data.data;
          self.totalItems = data.total;
          self.isShowSetting = true;
          self.displayRecord();
        } else {
          self.reset();
        }
        self.notification.hideCenterLoading();
      });
    } else {
      self.notification.showMessage(
        "error",
        self.i18n.getTranslation("DAILYATTEND_MSG_DATE_REQUIRED")
      );
    }
  }

  displayRecord() {
    var totalPage = Math.ceil(this.totalItems / this.pageSize);
    if (this.totalItems < this.pageSize && this.totalItems > 0) {
      this.from_record = 1;
      this.to_record = this.totalItems;
    } else if (this.page == totalPage) {
      this.from_record = (this.pageSize * (this.page-1)) + 1;
      this.to_record = this.totalItems;
    } else if(this.totalItems > 0){
      if (this.page == 1) {
        this.from_record = 1;
        this.to_record = this.pageSize;
      } else {
        this.from_record = (this.pageSize * (this.page-1)) + 1;
        this.to_record = this.from_record + this.pageSize -1;
      }
    }
    else{
        this.from_record = 0;
        this.to_record = 0;
    }
  }

  changePage(page) {
    this.page = page;
    this.searchAttendance(true);
  }

  saveChange() {
    this.notification.showCenterLoading();
    this.attendanceByPersonService
      .saveEmployeeAttendanceByPerson(this.hrid, new Date(this.startdate).toJSON(), new Date(this.finishdate).toJSON(), this.vacation, this.attendances)
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

  showSettingPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.attendanceByPersonService.getSettingByPerson().then(data => {
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
      this.attendances.forEach(function(item, index, arr) {
        item.in_time =
          CommonFunction.pad2(in_time.getHours()) +
          ":" +
          CommonFunction.pad2(in_time.getMinutes());
        item.out_time =
          CommonFunction.pad2(out_time.getHours()) +
          ":" +
          CommonFunction.pad2(out_time.getMinutes());
      });
      this.setting.reset_type = 2;
      this.notification.showCenterLoading();
      this.attendanceByPersonService.saveSetting(this.setting).then(data => {
        if (data.success) {
          this.saveChange();
          this.closeFactoryPopup();
          this.notification.hideCenterLoading();
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
    this.attendanceByPersonService
      .deleteSettingByPerson(this.setting.reset_id,
        this.attendances)
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

  onCloseProgram(){
    this.programService.closeCurrentProgram();
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
    // $(".input-edit").on("change", e => {
    //   e.target.replaceWith(e.currentTarget.value);
    //   if (flag == 1) {
    //     row.in_time = e.currentTarget.value;
    //   } else if (flag == 2) {
    //     row.out_time = e.currentTarget.value;
    //   }
    // });
  }

  showPopupEditWorkingTime($event, data){
    if(data.in_time==''||data.out_time==''||data.working_time==''){
      this.notification.showMessage("error", 'Cannot edit working time because in/out time is invalid');
      return;
    }

    this.editRow=data;
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    
    this.modalRef = this.modalService.show(this.popupEditWorkingTime, config);
  }
  closeEditWorkingTimePopup() {
    this.modalRef && this.modalRef.hide();
    this.editRow={};
  }

  updateWorkingTime(){
    this.editRow.edit_working_time_yn=true;
    console.log(this.editRow)
    this.notification.showCenterLoading();
    this.attendanceByPersonService
      .updateAttendanceWorkingTime(this.editRow)
      .then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.searchAttendance(true);
          this.notification.showMessage(
            "success",
            data.message
          );
          this.notification.hideCenterLoading();
        }
        this.closeEditWorkingTimePopup();
      });

    
  }
 cancelEditWorkingTime(){
   this.searchAttendance(true);
   this.closeEditWorkingTimePopup();
 }
  excelExport(){
    var self = this;
    if (self.startdate && self.finishdate) {
      this.notification.showCenterLoading();
      this.attendanceByPersonService.personAttendanceToExcel(
        self.hrid,
        self.startdate,
        self.finishdate,
        self.employeeName,self.department).then(res=>{
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
    console.log("check data", e , empl)
    empl.finish_gen_cd =e; 
  }
}
