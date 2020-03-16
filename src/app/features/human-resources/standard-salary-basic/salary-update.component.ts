import { Component, OnInit, Input, } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { HrSalaryModel } from '@app/core/models/hr/hr-salary.model';
import { Category } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrSalaryService } from '@app/core/services/hr.services/hr-salary.service';
import { AuthService, UserMasterService, CanDeactivateGuard, CRMSolutionApiService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';

@Component({
    selector: 'sa-salary-data',
    templateUrl: './salary-update.component.html',
})

export class SalaryDataComponent extends BasePage implements OnInit {
    salaryInfo: HrSalaryModel = new HrSalaryModel();
    year: any[] = [];
    month: any[] = [];
    user: any[] = [];
    salaryCode: GeneralMasterModel[] = [];
    companies: any = [];
    @Input() salaryJson: string;


    ngOnInit() {
        this.salaryInfo = JSON.parse(this.salaryJson);
        this.loadYear();
        this.companies.push(this.companyInfo)
        this.getSalaryCode().then(data => {
            this.salaryCode.push(...data);
        });
        this.GetUser().then(data => {
            this.user.push(...data);
        })
    }

    constructor(
        private api: CRMSolutionApiService,
        private notification: NotificationService,
        private generalMasterService: GeneralMasterService,
        private hrSalaryService: HrSalaryService,
        public userService: AuthService,
        public userMasterService: UserMasterService,
    ) {
        super(userService);
    }
    private getSalaryCode() {
        return this.generalMasterService.listGeneralByCate(Category.HRJobType.valueOf())
    }

    private GetUser() {
        return this.userMasterService.listUsers();
    }

    loadYear() {
        let now = new Date();
        let yearNow = now.getFullYear();
        let yearLast = yearNow - 6;
        for (let i = yearLast; i < yearLast + 15; i++) {
            this.year.push({ value: i, text: `${i}` })
        }
        for (let i = 1; i <= 12; i++) {
            this.month.push({ value: i, text: `${i}` })
        }
    }

    public validationOptions: any = {
        ignore: [], //enable hidden validate
        // Rules for form validation
        rules: {
            salary_code_gen_cd: {
                required: true
            },
            sbt_month: {
                required: true
            },
            sbt_year: {
                required: true
            },
            sbt_basic_amt: {
                required: true
            },
            sbt_1_atm: {
                required: true
            },
            sbt_2_atm: {
                required: true
            },
            sbt_3_atm: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            salary_code_gen_cd: {
                required: "Please select salary code"
            },
            sbt_month: {
                required: "Please select month"
            },
            sbt_year: {
                required: "Please select year"
            },
            sbt_basic_amt: {
                required: "Please select proper"
            },
            sbt_1_atm: {
                required: "Please select fuel fee"
            },
            sbt_2_atm: {
                required: "Please select phone fee"
            },
            sbt_3_atm: {
                required: "Please select food fee"
            }
        }
    };

    onSubmit() {
        console.log("salaryInfo", this.salaryInfo);
        this.hrSalaryService.updateSalaryInfo(this.salaryInfo).then(data => {
            if (data.error) {
                this.notification.showMessage("error", data.error.message);
            } else {
                this.notification.showMessage("success", data.message);
            }
        });
    }

    onReset() {
        $("form.frm-detail").validate().resetForm();
        this.salaryInfo = new HrSalaryModel()
    }
}