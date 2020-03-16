import { Component, OnInit } from "@angular/core";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { NotificationService, AuthService, ProgramService, OrganizationMasterService } from "@app/core/services";
import { OrganizationModel } from "@app/core/models/organization.model";
import { CommonFunction } from "@app/core/common/common-function";
import { GeneralMasterService } from "@app/core/services/features.services/general-master.service";
import { Category } from "@app/core/common/static.enum";
import { HrReportService } from "@app/core/services/hr.services/hr-report.service";

@Component({
    selector: "",
    templateUrl: "./adidas-monthly-overtime.component.html",
    styleUrls: ["./adidas-monthly-overtime.component.css"]
  })
  export class AdidasMonthlyOvertimeComponent extends BasePage implements OnInit {
    years: any = [];
    departments: OrganizationModel[] = [];
    employees: any;
    orgid: number = 0;
    month:string = "";
    calendar:Date = null;
    day_in_month: number = 0;
    from_record: number = 0;
    to_record: number = 0;
    page: number = 1;
    pageSize: number = 25;
    totalItems: number = 0;
    labels: any = {
        previousLabel: this.i18n.getTranslation("SPREVIOUS"),
        nextLabel: this.i18n.getTranslation("SNEXT")
    };

    constructor(
        public i18n: I18nService,
        private notification: NotificationService,
        public userService: AuthService,
        public organizationMasterService: OrganizationMasterService,
        public programService: ProgramService,
        private generalMasterService: GeneralMasterService,
        private monthlyOvertimeService: HrReportService
    ) {
        super(userService);
    }

    ngOnInit() {
        this.calendar = new Date();
        this.day_in_month = new Date(this.calendar.getFullYear(), this.calendar.getMonth() + 1, 0).getDate();
        this.years = CommonFunction.loadYears(-10,10);
        this.organizationMasterService
        .listOrganization(this.companyInfo.company_id)
        .then(d => {
            this.departments = d;
        });
    }

    exportXLSX():void {
      if(this.month)
      {
        this.notification.showCenterLoading();
        // this.monthlyOvertimeService.DownLoadAdidasMonthlyOverTime(this.orgid, this.calendar.getFullYear()).then(res=>{
        //   this.notification.hideCenterLoading();
        // })
      }
      else
      {
        this.notification.showMessage("error", this.i18n.getTranslation('MONTHLY_OVERTIME_MSG_REQUIRED_DATE'));
      }
    }

    search(isChange){
      if (!isChange) this.page = 1;
      if(this.month)
      {
        this.notification.showCenterLoading();
        this.monthlyOvertimeService.GetAdidasMonthlyOverTime(this.orgid,this.calendar.getFullYear(),this.calendar.getMonth() + 1,this.pageSize,this.page).then(data => {
            this.employees = data.data;
            this.totalItems = data.total;
            this.notification.hideCenterLoading();
            this.displayRecord();
        });
      }
      else
      {
        this.notification.showMessage("error", this.i18n.getTranslation('MONTHLY_OVERTIME_MSG_REQUIRED_DATE'));
      }
    }

    changeMonth(value){
      if(value)
      {
        this.month = value;
        this.calendar = new Date(value);
        this.day_in_month = new Date(this.calendar.getFullYear(), this.calendar.getMonth() + 1, 0).getDate();
      }
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

    changePage(page) {
        this.page = page;
        this.search(true);
    }

    onCloseProgram(){
        this.programService.closeCurrentProgram();
    }
  }