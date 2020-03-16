import { Component, OnInit } from "@angular/core";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { NotificationService, AuthService, ProgramService, OrganizationMasterService } from "@app/core/services";
import { HrReportService } from "@app/core/services/hr.services/hr-report.service";
import { OrganizationModel } from "@app/core/models/organization.model";
import { Category } from "@app/core/common/static.enum";
import { GeneralMasterService } from "@app/core/services/features.services/general-master.service";

@Component({
    selector: "hr-payroll-master",
    templateUrl: "./daily-duty-dept.component.html",
    styleUrls: ["./daily-duty-dept.component.css"]
  })
  export class DailyDutyByDeptComponent extends BasePage implements OnInit {
    calendar:Date;
    department: any = {};
    departments: OrganizationModel[] = [];
    attendances: any = [];
    orgid: number = 0;
    from_record: number = 0;
    to_record: number = 0;
    page: number = 1;
    pageSize: number = 10000;
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
        private dailydutybydeptService: HrReportService,
        private generalMasterService: GeneralMasterService,
    ) {
        super(userService);
    }

    ngOnInit() {
        var self = this;
        self.department.detail = []
        self.organizationMasterService
        .listOrganization(self.companyInfo.company_id)
        .then(d => {
            d.filter(function(e){
                if(e.level == 0)
                {
                    self.departments.push(e);
                }
            });
        });
        self.generalMasterService.listGeneralByCate(Category.AttendLogType.valueOf()).then(data => {
          self.attendances = data;
      });
    }

    
    exportXLSX():void {
        if(this.calendar && this.orgid)
        {
          this.notification.showCenterLoading();
          this.dailydutybydeptService.DownLoadDailyDutyByDept(this.orgid, new Date(this.calendar).getFullYear(),new Date(this.calendar).getMonth() + 1, new Date(this.calendar).getDate()).then(res=>{
            this.notification.hideCenterLoading();
          });
        }
        else
        {
          this.notification.showMessage("error", this.i18n.getTranslation('DAILY_DUTY_DEPT_MSG_REQUIRED_DATE_DEPT'));
        }
      }
  
      search(isChange){
        if (!isChange) this.page = 1;
        if(this.calendar && this.orgid)
        {
          this.notification.showCenterLoading();
          this.dailydutybydeptService.GetDailyDutyByDept(this.orgid, new Date(this.calendar).getFullYear(),new Date(this.calendar).getMonth() + 1, new Date(this.calendar).getDate(),this.pageSize,this.page).then(data => {
              this.department = data.data;
              this.totalItems = data.total;
              this.displayRecord();
              this.notification.hideCenterLoading();
          });
        }
        else
        {
          this.notification.showMessage("error", this.i18n.getTranslation('DAILY_DUTY_DEPT_MSG_REQUIRED_DATE_DEPT'));
        }
      }
  
      changeDate(value){
        if(value)
        {
          this.department.detail = [];
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