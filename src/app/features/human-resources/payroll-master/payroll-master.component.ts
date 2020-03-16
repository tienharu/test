import { Component, OnInit, ViewChild } from "@angular/core";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import {
  NotificationService,
  AuthService,
  OrganizationMasterService
} from "@app/core/services";
import { PayrollMasterService } from "@app/core/services/hr.services/hr-payroll-master.service";
import { CommonFunction } from "@app/core/common/common-function";
import { OrganizationModel } from "@app/core/models/organization.model";
import {
  PayrollMasterModel,
  HrEmployeeModel,
  PayrollMasterDetailModel
} from "@app/core/models/hr/hr-payroll-master.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProgramService } from '@app/core/services';

@Component({
  selector: "hr-payroll-master",
  templateUrl: "./payroll-master.component.html",
  styleUrls: ["./payroll-master.component.css"]
})
export class PayrollMasterComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  monthsYear: any = [];
  payrollmonths: any = [];
  departments: OrganizationModel[] = [];
  settings: object = {};
  month: number = 0;
  year: number = 0;
  orgid: number = 0;
  calendar: string;
  model: PayrollMasterModel = new PayrollMasterModel();
  header: any = [];
  from_record: number = 0;
  to_record: number = 0;
  page: number = 1;
  pageSize: number = 25;
  totalItems: number = 0;
  employees: any[] = [];
  employeeName: string = "";
  employeeNo: string = "";
  fromCalendar: Date;
  toCalendar: Date;
  statusId: any = 0;
  labels: any = {
    previousLabel: this.i18n.getTranslation("SPREVIOUS"),
    nextLabel: this.i18n.getTranslation("SNEXT")
  };

  @ViewChild("popupPayroll") popupPayroll;
  @ViewChild("popupCopyPayroll") popupCopyPayroll;

  constructor(
    public i18n: I18nService,
    private notification: NotificationService,
    public userService: AuthService,
    private modalService: BsModalService,
    public programService: ProgramService,
    public organizationMasterService: OrganizationMasterService,
    public payrollMasterService: PayrollMasterService
  ) {
    super(userService);
    this.reset();
  }

  reset() {
    this.model = new PayrollMasterModel();
    this.employees = [];
    this.page = 1;
    this.totalItems = 0;
    this.employeeName = "";
  }

  ngOnInit() {
    this.monthsYear = CommonFunction.bindYearMonth(3,2);
    this.organizationMasterService
      .listOrganization(this.companyInfo.company_id)
      .then(d => {
        this.departments = d;
      });
    this.payrollMasterService.GetPayrollMonths().then(d => {
      this.payrollmonths = d.data;
    });
    this.displayRecord();
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

  searchPayroll(isChange) {
    if (this.month > 0 && this.year > 0) {
      if (!isChange) this.page = 1;
      this.notification.showCenterLoading();
      this.payrollMasterService
        .getPayrollMaster(
          this.statusId,
          this.orgid,
          this.employeeName,
          this.employeeNo,
          this.year,
          this.month,
          this.pageSize,
          this.page
        )
        .then(data => {
          if (data.data) {
            this.header = data.header;
            this.model = data.data;
            this.employees = this.model.details;
            this.totalItems = data.total;
            this.notification.hideCenterLoading();
            this.displayRecord();
          } else {
            this.reset();
          }
        });
    } else {
      this.notification.showMessage(
        "error",
        this.i18n.getTranslation("PAYROLL_MASTER_MSG_MONTH_YEAR_REQUIRED")
      );
    }
  }

  changePage(page) {
    this.page = page;
    this.searchPayroll(true);
  }

  copyPayroll() {
    let fromDate = new Date(this.fromCalendar);
    let toDate = new Date(this.toCalendar);
    this.page = 1;
    this.month = toDate.getMonth() + 1;
    this.year = toDate.getFullYear();
    this.notification.showCenterLoading();
    this.payrollMasterService.copyPayrollMaster(fromDate.getMonth() + 1, fromDate.getFullYear(), this.month, this.year, this.pageSize).then(data => {
      this.notification.hideCenterLoading();  
      if (data.error) {
          this.notification.showError(data.error.message);
          return;
        } else {
          if(data.success && data.existed){
            this.notification.confirmDialog('Payroll Replacement', data.message, (x) => {
              if (x) {
                this.notification.showCenterLoading();
                this.payrollMasterService.copyPayrollMaster(fromDate.getMonth() + 1, fromDate.getFullYear(), this.month, this.year, this.pageSize, true).then(data => {
                  this.notification.hideCenterLoading();
                  if (data.error) {
                    this.notification.showError(data.error.message);
                    return;
                  } 
                  this.notification.showSuccess(this.i18n.getTranslation("PAYROLL_MASTER_MSG_SAVE_SUCCESSFUL"));
                  this.payrollMasterService.GetPayrollMonths().then(d => {
                    this.payrollmonths = d.data;
                    this.calendar = this.year + "-" + this.month + "-1";
                  });
                  if (data.data) {
                    this.header = data.header;
                    this.model = data.data;
                    this.employees = this.model.details;
                    this.totalItems = data.total;
                    this.displayRecord();
                  } else {
                    this.reset();
                  }
                });
              }
            });
          }
          else if(data.success){
            this.notification.showSuccess(this.i18n.getTranslation("PAYROLL_MASTER_MSG_SAVE_SUCCESSFUL"));
            this.payrollMasterService.GetPayrollMonths().then(d => {
              this.payrollmonths = d.data;
              this.calendar = this.year + "-" + this.month + "-1";
            });
            if (data.data) {
              this.header = data.header;
              this.model = data.data;
              this.employees = this.model.details;
              this.totalItems = data.total;
              this.displayRecord();
            } else {
              this.reset();
            }
          }
          
          
        }
      });
    this.closeFactoryPopup();
  }

  createPayroll() {
    this.notification.confirmDialog('Payroll Confirmation', `Do you want to create payroll master for ${this.year}-${this.month}?`, (x) => {
      if (x) {
        this.page = 1;
        this.notification.showCenterLoading();
        this.payrollMasterService.createPayrollMaster(this.year, this.month, this.pageSize).then(data => {
            this.notification.hideCenterLoading();
            if (data.error) {
              this.notification.showError(data.error.message);
              return;
            } else {
              // if(data.success && data.existed){
              //   this.notification.confirmDialog('Payroll Replacement', data.message, (x) => {
              //     if (x) {
              //       this.notification.showCenterLoading();
              //       this.payrollMasterService.createPayrollMaster(this.year, this.month, this.pageSize, true).then(data => {
              //         this.notification.hideCenterLoading();
              //         if (data.error) {
              //           this.notification.showError(data.error.message);
              //           return;
              //         } 
              //         this.notification.showSuccess(this.i18n.getTranslation("PAYROLL_MASTER_MSG_SAVE_SUCCESSFUL"));
              //         this.payrollMasterService.GetPayrollMonths().then(d => {
              //           this.payrollmonths = d.data;
              //           this.calendar = this.year + "-" + this.month + "-1";
              //         });
              //         if (data.data) {
              //           this.header = data.header;
              //           this.model = data.data;
              //           this.employees = this.model.details;
              //           this.totalItems = data.total;
              //           this.displayRecord();
              //         } else {
              //           this.reset();
              //         }
              //       });
              //     }
              //   });
              // }
              // else 
              if(data.success){
                if(data.total==0){
                  this.notification.showInfo(data.message);
                }
                else{
                  this.notification.showSuccess(this.i18n.getTranslation("PAYROLL_MASTER_MSG_SAVE_SUCCESSFUL"));
                }
                this.payrollMasterService.GetPayrollMonths().then(d => {
                  this.payrollmonths = d.data;
                  this.calendar = this.year + "-" + this.month + "-1";
                });
                if (data.data) {
                  this.header = data.header;
                  this.model = data.data;
                  this.employees = this.model.details;
                  this.totalItems = data.total;
                  this.displayRecord();
                } else {
                  this.reset();
                }
              }
            }
          });
        this.closeFactoryPopup();
      }
    });
    
  }

  editAmount(element, col, row) {
    if (row[col].display_type < 2) {
      var cellElement = $(element.target);
      console.log(cellElement)
      cellElement.text("");
      cellElement.append(
        `<input type="number" pattern="/^-?\d+\.?\d*$/" onfocus="this.select();" onKeyPress="if(this.value.length==12) return false;" style="background-color: white; border: #bfbdbd solid 1px; text-align: right; width: 100%; padding: 0px; height: 20px; line-height: 20px; padding: 2px;" class="input-edit" value="${row[
          col
        ].amount || 0}" />`
      );
      cellElement.find(".input-edit").focus();
      cellElement.find(".input-edit").focusout(function(e) {
        e.target.replaceWith(parseInt(e.currentTarget.value).toLocaleString());
        row[col].amount = e.currentTarget.value;
      });
      $(".input-edit").on("change", e => {
        e.target.replaceWith(parseInt(e.currentTarget.value).toLocaleString());
        row[col].amount = e.currentTarget.value;
      });
    }
  }

  saveChange() {
    this.notification.showCenterLoading();
    this.payrollMasterService.savePayrollMaster(this.model).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.searchPayroll(false);
        this.notification.showMessage(
          "success",
          this.i18n.getTranslation("PAYROLL_MASTER_MSG_SAVE_SUCCESSFUL")
        );
      }
      this.notification.hideCenterLoading();
    });
  }

  getCalendar(value) {
    let date = new Date(value);
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
  }

  showPayrollPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.modalRef = this.modalService.show(this.popupPayroll, config);
  }

  showCopyPayrollPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.fromCalendar = null;
    this.toCalendar = null;
    this.modalRef = this.modalService.show(this.popupCopyPayroll, config);
  }

  closeFactoryPopup() {
    this.modalRef && this.modalRef.hide();
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }

  excelExport(){
    this.notification.showCenterLoading();
        this.payrollMasterService.PayrollMasterToExcel(this.statusId,
          this.orgid,
          this.employeeName,
          this.employeeNo,
          this.year,
          this.month,).then(res=>{
            this.notification.hideCenterLoading();
        });
  }
}
