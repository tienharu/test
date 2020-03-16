import { Component, OnInit } from '@angular/core';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { NotificationService, AuthService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrReportService } from '@app/core/services/hr.services/hr-report.service';
import { BasePage } from '@app/core/common/base-page';
import { OrganizationModel } from '@app/core/models/organization.model';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'sa-summary-excel.component',
  templateUrl: './summary-excel.component.html',
  styleUrls: ['./summary-excel.component.css']
})
export class GvnReportSummaryExcelComponent extends BasePage implements OnInit {
  departments: OrganizationModel[] = [];
  orgid: number = 0;
  monthsYear: any = [];
  month: any = 0;
  year: any = 0;
  years:any=[];

  adidasOrgId: number = 0;
  adidasOTYear:any=0;
  adidasOverTurnYear:any=0;
  adidasWeekWHYear:any=0;
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
    this.years = CommonFunction.bindYears(-10,1);
    this.adidasOTYear=this.adidasOverTurnYear=this.adidasWeekWHYear=new Date().toString('yyyy')
  }
  changeMonth(value){
    if(value)
    {
      this.month = value.split('-')[1];
      this.year = value.split('-')[0];
    }
  }

  downloadMonthlyOT():void {
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

  adidasMOnthlyOT(){
    this.notification.showCenterLoading();
    this.monthlyAttendanceService.DownLoadAdidasMonthlyOverTime(this.companyInfo.company_id,this.adidasOrgId, this.adidasOTYear).then(res=>{
        this.notification.hideCenterLoading();
    });
  }
  adidasMOnthlyTurnOver(){
    this.notification.showCenterLoading();
    this.monthlyAttendanceService.DownLoadAdidasMonthlyTurnOver(this.companyInfo.company_id, this.adidasOverTurnYear).then(res=>{
        this.notification.hideCenterLoading();
    });
  }
  adidasWeeklyWH(){
    this.notification.showCenterLoading();
    this.monthlyAttendanceService.DownLoadAdidasWeeklyWorkingHour(this.companyInfo.company_id, this.adidasWeekWHYear).then(res=>{
        this.notification.hideCenterLoading();
    });
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
}
}
