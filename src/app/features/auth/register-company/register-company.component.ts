import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyModel } from '@app/core/models/company.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CRMSolutionApiService, AuthService, NotificationService } from '@app/core/services';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { Category } from '@app/core/common/static.enum';
import { NameValueModel } from '@app/core/models/name-value.model';
import { SubmitModel } from '@app/core/models/submit.model';
import { MasSysPackage } from '@app/core/models/mas-sys-package.model';
import { csLocale } from 'ngx-bootstrap';

@Component({
  selector: 'sa-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit {
  regisCompanyForm: FormGroup;
  submit_id: number = 0;
  username: string = '';
  email: string = '';
  model: CompanyModel;
  submitted = false;
  submitModel: SubmitModel;
  errMessage: string = '';
  currencies: GeneralMasterModel[] = [];
  countries: GeneralMasterModel[] = [];
  businessConditions: GeneralMasterModel[] = [];
  businessCategory: GeneralMasterModel[] = [];
  packages: MasSysPackage[] = [];

  companyTypes: NameValueModel[] = [
    {
      name: '법인',
      value: 1
    },
    {
      name: '개인',
      value: 2
    }
  ];

  usingTypes: NameValueModel[] = [
    {
      name: '무료',
      value: 'Free'
    },
    {
      name: '유료',
      value: 'Payment'
    }
  ];

  // paymentLevels: NameValueModel[] = [
  //   {
  //     name: '1 month',
  //     value: 50000
  //   },
  //   {
  //     name: '2 months',
  //     value: 75000
  //   }, {
  //     name: '3 months',
  //     value: 100000
  //   }
  // ];

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: CRMSolutionApiService,
    private authService: AuthService,
    private notification: NotificationService) { }

  ngOnInit() {
    this.submit_id = this.route.snapshot.queryParams['submit_id'] || 0;
    this.username = this.route.snapshot.queryParams['username'] || '';
    this.email = this.route.snapshot.queryParams['email'] || '';
    $("#payment_level").prop("disabled", true);

    this.getCurrencies().then(data => {
      // trick to avoid null array.
      setTimeout(() => {
        this.currencies.push(...data);
      }, 200);
    });
    this.getCountries().then(data => {
      // trick to avoid null array.
      setTimeout(() => {
        this.countries.push(...data);
      }, 200);
    });

    this.getBusinessConditions().then(data => {
      // trick to avoid null array.
      setTimeout(() => {
        this.businessConditions.push(...data);
      }, 200);
    });

    this.getBusinessCategory().then(data => {
      // trick to avoid null array.
      setTimeout(() => {
        this.businessCategory.push(...data);
      }, 200);
    });

    this.getPackages().then(data => {
      this.packages.push(...data);
    });

    this.model = new CompanyModel();
    // set default email.
    this.model.email = this.email;
    this.createForm();

    console.log(this.packages);
  }

  private getCurrencies() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/sysgeneral/details/catecd/${Category.CurrencyCateCode.valueOf()}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  private getCountries() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/sysgeneral/details/catecd/${Category.CountryCateCode.valueOf()}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  private getBusinessConditions() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/sysgeneral/details/catecd/${Category.BusinessConditionCateCode.valueOf()}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  private getBusinessCategory() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/sysgeneral/details/catecd/${Category.BusinessCategoryCateCode.valueOf()}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  private getPackages() {
    return new Promise<any>((resolve, reject) => {
      this.api.get('/package/list').subscribe(data => {
        resolve(data.data);
      });
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.regisCompanyForm.controls; }

  createForm() {
    this.regisCompanyForm = this.fb.group({
      submit_id: '',
      company_local_nm: ['', Validators.required],
      company_eng_nm: '',
      company_sim_nm: ['', Validators.required],
      company_type: ['', Validators.required],
      country_gen_cd: ['', Validators.required],
      currency_gen_cd: ['', Validators.required],
      com_regist_num: ['', Validators.required],
      biz_regist_num: ['', Validators.required],
      biz_conditions_gen_cd: ['', Validators.required],
      biz_type_gen_cd: ['', Validators.required],
      zip_code: ['', Validators.required],
      address: ['', Validators.required],
      ceo_local_nm: '',
      tel_no: ['', Validators.required],
      fax_no: '',
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
      homepage: '',
      biz_keyword: '',
      usingType: ['', Validators.required],
      payment_level: '',
      money_month: '',
    });
  }

  onTypeOfUsingChanged() {
    if (this.model.usingType === 'Free') {
      this.model.payment_level = '';
      $("#payment_level").prop("disabled", true);
    } else {
      $("#payment_level").prop("disabled", false);
    }
  }

  onPaymentLevelChanged(event) {
    // console.log("money/month: " + event);
    this.model.money_month = event;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.regisCompanyForm.invalid) {
      return;
    }

    // call API.
    this.model.submit_id = this.submit_id;
    this.model.user_id = this.route.snapshot.queryParams['user_id'] || 0;
    this.model.use_yn = false;
    console.log(`Submitting ${JSON.stringify(this.model)}`);

    // insert data to company.
    this.api.post("company/insert", this.model).subscribe(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.data.message);
      } else {
        this.notification.showMessage("success", data.data.message);
        this.notification.showMessage("success", "Now you can login to the system using the information that you have already registered.");

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1000);
      }
    });
  }

  onCancel() {
    this.submitted = false;
    // this.model = new CompanyModel();
    this.showPopup();
  }

  showPopup() {
    this.notification.smartMessageBox({
      title: "Warning",
      content: "회사등록이 정상적으로 진행되지 않았습니다. 지금 취소하면 이전 모든 단계는 삭제처리 되고 처음단계부터 다시 진행해야 됩니다. 취소하시겠습니까 ?",
      buttons: '[Cancel][OK]'
    },
      ButtonPressed => {
        if (ButtonPressed == "OK") {
          // call API.
          this.submitModel = new SubmitModel();
          this.submitModel.submit_id = this.submit_id;
          
          this.api.post("submit/delete", this.submitModel).subscribe(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.data.message);
            } else {
              this.notification.showMessage("success", data.data.message);
              this.router.navigate(['/auth/login']);
            }
          });
        }
      }
    );
  }

}
