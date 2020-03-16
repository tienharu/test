import { Component, OnInit } from "@angular/core";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { ProgramService } from '@app/core/services/program.service';
import { HrOvertimeTableService } from '@app/core/services/hr.services/hr-overtime-table.service';
import {
  NotificationService,
  AuthService,
  CanDeactivateGuard
} from "@app/core/services";
import { DutyTypeService } from "@app/core/services/hr.services/hr-mas-dutytype.service";
import { DutyTypeModel } from "@app/core/models/hr/hr-mas-duty-type.model";
import { CommonFunction } from "@app/core/common/common-function";
import { ProgramList } from "@app/core/common/static.enum";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "mas-duty-type",
    templateUrl: "./duty-type.component.html",
    styleUrls: ["./duty-type.component.css"]
})
export class DutyTypeComponent extends BasePage implements OnInit, CanDeactivateGuard {
    userInfo:any;
    overtimes: any = [];
    payrollitems: any;
    tempPayrollitems: any;
    dutyType: DutyTypeModel;
    selectedPayrollItems: any=[];
    options: any;
    isHide:boolean = true;

    constructor(
        public i18n: I18nService,
        private notification: NotificationService,
        public userService: AuthService,
        public overtimeTableService: HrOvertimeTableService,
        public dutyTypeService: DutyTypeService,
        public programService: ProgramService,
    ) {
    super(userService);
    this.userInfo = this.userService.getUserInfo();
    this.dutyType = dutyTypeService.getModel();
    }

    public validationOptions: any = {
        ignore: [], //enable hidden validate
        // Rules for form validation
        rules: {
            duty_type_nm: {
            required: true
          },
          ot_table_id: {
            required: true
          },
          start_work_time: {
            required: true
          },
          end_work_time: {
            required: true
          }
        },
        // Messages for form validation
        messages: {
            duty_type_nm: {
            required: this.i18n.getTranslation('DUTY_TYPE_MSG_NAME_REQUIRED')
          },
          ot_table_id: {
            required: this.i18n.getTranslation('DUTY_TYPE_MSG_OVERTIME_REQUIRED')
          },
          start_work_time: {
            required: this.i18n.getTranslation('DUTY_TYPE_MSG_STARTWORKTIME_REQUIRED')
          },
          end_work_time: {
            required: this.i18n.getTranslation('DUTY_TYPE_MSG_ENDWORKTIME_REQUIRED')
          },
        }
    };
      
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        this.dutyTypeService.storeTemporaryModel(this.dutyType);
        return true;
    }
    ngOnInit() {
        this.checkPermission(ProgramList.duty_type.valueOf());
        this.overtimeTableService.listOverTimeTable(this.userInfo.company_id).then(data => {
            this.overtimes = data;
        });
        this.dutyTypeService.GetPayrollItems().then(data => {
            this.payrollitems = data.data;
            this.tempPayrollitems = data.data;
        });
        this.initData();
    }

    initData(){
      var self = this;
      self.options = {
        dom: "Bfrtip",
        ajax: (data, callback, settings) => {
            this.dutyTypeService.getDutyTypes().then(data => {
                callback({
                    aaData: data.data
                });
            })
        },
        columns: [
            { 
                data: "duty_type_id", className: "center", width: "50px" 
            },
            {
                data: "duty_type_nm", className: "", width: "200px" 
            },
            {
                data: "ot_table_name", className: "", width: "200px"
            },
            {
                data: "start_work_time", className: "center", width: "60px"
            },
            {
                data: "end_work_time", className: "center", width: "60px"
            },
            {
                data: "select_range_machine_from", className: "center", width: "60px"
            },
            {
                data: "select_range_machine_to", className: "center", width: "60px"
            },
            {
              data: "night_time_from", className: "center", width: "60px"
            },
            {
              data: "night_time_to", className: "center", width: "60px"
            },
            {
              data: "ot_before_minute", className: "center", width: "60px"
            },
            {
              data: (data, type, dataToSet) => {
                  return data.overlap_date_yn ? "Yes" : "No";
              },
              className: "center"
            },
            {
              data: (data, type, dataToSet) => {
                  return data.ot_before_start_yn ? "Yes" : "No";
              },
              className: "center"
            },
            {
                data: (data, type, dataToSet) => {
                    return data.use_yn ? "Yes" : "No";
                },
                className: "center"
            },
            { 
                data: "creator", className: "" 
            },
            { 
                data: "created_time", className: "center"
            },
        ],
        scrollY: 600,
        scrollX: true,
        paging: true,
        pageLength: 25,
        buttons: [
            {
                text: '<i class="fa fa-refresh" title="Refresh"></i>',
                action: (e, dt, node, config) => {
                    dt.ajax.reload();
                    this.dutyType = new DutyTypeModel();
                }
            },
            {
                extend: "selected",
                text: '<i class="fa fa-trash-o" title="Delete"></i>',
                action: (e, dt, button, config) => {
                    if(!this.permission.canDelete){
                        this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
                        return;
                      }
                    var rowSelected = dt.row({ selected: true }).data();
                    if (rowSelected) {
                        var selectedText: string = rowSelected.payroll_item_name;
                        this.notification.confirmDialog(
                            this.i18n.getTranslation('PAYROLL_ITEM_CONFIRM'),
                            this.i18n.getTranslation('PAYROLL_ITEM_CONFIRM_DELETE') + ` ${selectedText}?`,
                            x => {
                                if (x) {
                                    this.dutyTypeService.delete(this.dutyType).then(data => {
                                      if (data.error) {
                                        this.notification.showMessage("error", data.error.message);
                                      } else {
                                        this.notification.showMessage(
                                          "success",
                                          data.message
                                        );
                                        this.reloadDatatable();
                                        this.onReset();
                                      }
                                    })
                                }
                            }
                        );
                    }
                }
            },
            "copy",
            "excel",
            "pdf",
            "print"
        ]
    };
    }

    onRowClick(event) {
        var f = $("form.frm-detail").validate();
        if (!f.valid()) {
          f.resetForm();
        }
        var self = this;
        self.changeOverLap(event.overlap_date_yn);
        self.dutyType = event;
        self.selectedPayrollItems = event.payroll_items;
        var newList = [];
        self.tempPayrollitems.forEach(function(current, index, arr){
            var existed = self.selectedPayrollItems.filter(function(el) {
                return el.payrollitemid === current.payrollitemid;
            });
            if(existed.length == 0)
            {
                newList.push(current);
            }
        });
        self.payrollitems = newList;
    }

    private reloadDatatable() {
        $(".listInfo")
            .DataTable()
            .ajax.reload();
    }

    addPayrollItem(id)
    {
      var self = this;
      var newList = [];
      self.payrollitems.filter(function(current, index, arr){
        if(id == current.payrollitemid)
        {
          self.selectedPayrollItems.push(current);
        }
        else{
          newList.push(current);
        }
      });
      self.payrollitems = newList;
      self.sortByKey(self.selectedPayrollItems, "payrollitemid");
    }

    removePayrollItem(id){
      var self = this;
      var newList = [];
      self.selectedPayrollItems.forEach(function(current, index, arr){
        if(id != current.payrollitemid)
        {
          newList.push(current);
        }
        else
        {
            self.payrollitems.push(current);
        }
      });
      self.selectedPayrollItems = newList;
      self.sortByKey(self.selectedPayrollItems, "payrollitemid");
      self.sortByKey(self.payrollitems, "payrollitemid");
    }

    sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    onSubmit(){
      if(this.dutyType.ot_table_id > 0)
      {
        var start_work_time = Date.parse(
          new Date().toString("M/d/yyyy") + " " + this.dutyType.start_work_time
        );
        this.dutyType.start_work_time = CommonFunction.pad2(start_work_time.getHours()) + ":" + CommonFunction.pad2(start_work_time.getMinutes());
        var end_work_time = Date.parse(
          new Date().toString("M/d/yyyy") + " " + this.dutyType.end_work_time
        );
        this.dutyType.end_work_time = CommonFunction.pad2(end_work_time.getHours()) + ":" + CommonFunction.pad2(end_work_time.getMinutes());
        var select_range_machine_from = Date.parse(
          new Date().toString("M/d/yyyy") + " " + this.dutyType.select_range_machine_from
        );
        this.dutyType.select_range_machine_from = CommonFunction.pad2(select_range_machine_from.getHours()) + ":" + CommonFunction.pad2(select_range_machine_from.getMinutes());
        var select_range_machine_to = Date.parse(
          new Date().toString("M/d/yyyy") + " " + this.dutyType.select_range_machine_to
        );
        this.dutyType.select_range_machine_to = CommonFunction.pad2(select_range_machine_to.getHours()) + ":" + CommonFunction.pad2(select_range_machine_to.getMinutes());
        var night_time_from = Date.parse(
          new Date().toString("M/d/yyyy") + " " + this.dutyType.night_time_from
        );
        this.dutyType.night_time_from = CommonFunction.pad2(night_time_from.getHours()) + ":" + CommonFunction.pad2(night_time_from.getMinutes());
        var night_time_to = Date.parse(
          new Date().toString("M/d/yyyy") + " " + this.dutyType.night_time_to
        );
        this.dutyType.night_time_to = CommonFunction.pad2(night_time_to.getHours()) + ":" + CommonFunction.pad2(night_time_to.getMinutes());
        this.dutyType.payroll_items = this.selectedPayrollItems;
        this.dutyTypeService.saveDutyTypes(this.dutyType).then(data => {
          if (data.error) {
              if(data.error.message == "existed")
              {
                  this.notification.showMessage("error", this.i18n.getTranslation("EXISTED"));
              }
              else
              {
                  this.notification.showMessage("error", data.error.message);
              }
          } else {
              this.notification.showMessage("success", data.message);
              this.reloadDatatable();
          }
        });
      }
    }

    onReset() {
        $("form.frm-detail").validate().resetForm();
        this.dutyType = new DutyTypeModel();
        this.isHide = true;
        this.selectedPayrollItems = [];
        this.payrollitems = this.tempPayrollitems;
    }

    changeOverLap(value){
      if(value)
      {
        this.isHide = false;
      }else{
        this.isHide = true;
        this.dutyType.select_range_machine_from = "";
        this.dutyType.select_range_machine_to = "";
      }
    }

    changeOT(value){
      this.dutyType.ot_table_id = value;
    }

    onCloseProgram(){
        this.programService.closeCurrentProgram();
    }
}