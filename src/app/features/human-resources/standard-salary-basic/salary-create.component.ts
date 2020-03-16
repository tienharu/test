import { Component, OnInit, Input, } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { HrSalaryModel, HeaderModel } from '@app/core/models/hr/hr-salary.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrSalaryService } from '@app/core/services/hr.services/hr-salary.service';
import { AuthService, UserMasterService, CanDeactivateGuard, CRMSolutionApiService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';
import { ProgramList } from '@app/core/common/static.enum';

@Component({
    selector: 'sa-salary-create-data',
    templateUrl: './salary-create.component.html',
})

export class SalaryCreateDataComponent extends BasePage implements OnInit {
    salaryInfo: HrSalaryModel = new HrSalaryModel();
    year: any[] = [];
    month: any[] = [];
    yearMonth: any;
    @Input() lastMonthData: string;

    ngOnInit() {
        this.checkPermission(ProgramList.Basic_Salary_Master.valueOf());
        this.salaryInfo.company_id = this.companyInfo.company_id;
        if(this.lastMonthData){
            this.yearMonth = this.lastMonthData;
        }
        else{
            this.yearMonth=[];
        }
        
        this.loadYear();
        setTimeout(() => {
            this.salaryInfo.sbt_year= this.yearMonth.sbtyear
            this.salaryInfo.sbt_month= parseInt(this.yearMonth.sbtmonth)+1
        }, 100);
    }

    constructor(
        private api: CRMSolutionApiService,
        private notification: NotificationService,
        private hrSalaryService: HrSalaryService,
        public userService: AuthService
    ) {
        super(userService);
    }


    loadYear() {
        let now = new Date();
        let yearNow = now.getFullYear();
        let yearLast = yearNow + 2;
        for (let i = yearNow; i < yearLast; i++) {
            this.year.push({ value: i, text: `${i}` })
        }
        for (let i = 1; i <= 12; i++) {
            this.month.push({ value: i, text: `${i}` })
        }
    }

    onSubmit() {
        this.hrSalaryService.CreateSalaryInfo(this.salaryInfo.company_id, this.salaryInfo.sbt_month, this.salaryInfo.sbt_year).then(data => {
            // if(this.salaryInfo.sbt_month <= data.yearmonth.sbtmonth && this.salaryInfo.sbt_year < data.yearmonth.sbtyear){
            //     this.notification.showMessage("error",data.error.message);
            // }
            if (data.error) {
                this.notification.showMessage("error", data.error.message);
            } else {
                this.notification.showMessage("success", data.message);
            }
        });
    }
}