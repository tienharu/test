import { Component, OnInit } from '@angular/core';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { NotificationService, AuthService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrReportService } from '@app/core/services/hr.services/hr-report.service';
import { BasePage } from '@app/core/common/base-page';
import { OrganizationModel } from '@app/core/models/organization.model';
import { CommonFunction } from '@app/core/common/common-function';
/*
Keep backup for later, now using 1 page to download all GVN report
*/
@Component({
  selector: 'sa-gvn-monthly-attendance',
  templateUrl: './gvn-monthly-attendance.component.html',
  styleUrls: ['./gvn-monthly-attendance.component.css']
})
export class GvnMonthlyAttendanceComponent extends BasePage implements OnInit {
  departments: OrganizationModel[] = [];
  orgid: number = 0;
  monthsYear: any = [];
  month: any = 0;
  year: any = 0;
  constructor(
    public i18n: I18nService,
    private notification: NotificationService,
    public userService: AuthService,
    public organizationMasterService: OrganizationMasterService,
    public programService: ProgramService,
    private generalMasterService: GeneralMasterService,
    private monthlyAttendanceService: HrReportService
) {
    super(userService);
}

  ngOnInit() {
    this.organizationMasterService
    .listOrganization(this.companyInfo.company_id)
    .then(d => {
        this.departments = d;
    });
    this.monthsYear = CommonFunction.bindYearMonth(12,1);
  }
  changeMonth(value){
    if(value)
    {
      this.month = value.split('-')[1];
      this.year = value.split('-')[0];
    }
  }

  exportXLSX():void {
    if(this.month && this.year)
    {
        this.notification.showCenterLoading();
        this.monthlyAttendanceService.GVNDownloadMonthlyAttendance(this.companyInfo.company_id,this.orgid, this.year,this.month).then(res=>{
            this.notification.hideCenterLoading();
        });
    }
    else
    {
      this.notification.showMessage("error", this.i18n.getTranslation('MONTHLY_ATTEND_MSG_REQUIRED_DATE'));
    }
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
}
}
