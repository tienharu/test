import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HrNewCareerModel } from '@app/core/models/hr/hr-new-career.model';
import { NotificationService, OrganizationMasterService, AuthService } from '@app/core/services';
import { HrNewCareerService } from '@app/core/services/hr.services/hr-new-career.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { parse } from 'path';
import { GetInfoHrService } from './get-info-hr.service';
import { BasePage } from '@app/core/common/base-page';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-new-path-career',
  templateUrl: './new-path-career.component.html',
  styleUrls: ['./new-path-career.component.css']
})
export class NewPathCareerComponent extends BasePage implements OnInit {
  @Input() companyId: number = 0;
  @Input() hrId: string = '';
  @Input() pathCareerInfoJson:any;
  @Input() pathCareerInfo: HrNewCareerModel;//pathCareerInfoJson
  @Input() isAddNew : string;
  @Input() formData : any[] = [];
  @Output() resetParent = new EventEmitter();

  Org: any[] = [];
  Salary: any[] = [];
  HRClass: any[] = [];
  DutyKind: any[] = [];
  DutyType: any[] = [];
  DutyStatus: any[] = [];
  WorkPlace: any[] = [];
  TaxCode: any[] = [];
  PathCareer: any[] = [];

  fromOrg : number = 0;
  fromSalary: number = 0;
  
  constructor(
    private notification: NotificationService,
    private hrNewCareerService: HrNewCareerService,
    private generalMasterService: GeneralMasterService,
    private orgMasterService : OrganizationMasterService,
    private getInfoHrService : GetInfoHrService,
    public userService: AuthService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }
  
//validate
public validPathCareOptions: any = {
  ignore: [], //enable hidden validate
  // Rules for form validation
  rules: {
    path_ymd: {
      required: true
    },
    path_gen_cd: {
      required: true
    },
  },
  // Messages for form validation
  messages: {
    path_ymd: {
      required: "Please enter"
    },
    path_gen_cd: {
      required: "Please enter"
    },
  }
};
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.isAddNew === "false" ? this.pathCareerInfo = JSON.parse(this.pathCareerInfoJson) : this.onReset()
    let _formData : any[] = JSON.parse("["+this.formData+"]");
   this.Org = _formData[0][0];
   this.Salary = _formData[0][1]
   this.HRClass = _formData[0][2]
   this.DutyKind = _formData[0][3]
   this.DutyType = _formData[0][4]
   this.DutyStatus = _formData[0][5]
   this.WorkPlace = _formData[0][6]
   this.TaxCode = _formData[0][7]
   this.PathCareer=_formData[0][8]

   console.log('this.pathCareerInfo',this.pathCareerInfo)
   //
   this.loadHrDetail().then(data => {
     if(this.isAddNew === "true"){
      this.pathCareerInfo.from_job_type_gen_cd = data.job_type_gen_cd;
      this.pathCareerInfo.from_hr_class_gen_cd = data.hr_class_gen_cd;
      this.pathCareerInfo.from_duty_kind_gen_cd = data.duty_kind_gen_cd;
      this.pathCareerInfo.from_duty_type_id = data.from_duty_type_id;
      this.pathCareerInfo.from_duty_status_gen_cd = data.duty_status_gen_cd;
      this.pathCareerInfo.from_work_place_gen_cd = data.work_place_gen_cd;
      this.pathCareerInfo.from_tax_cd_gen_cd = data.tax_code_gen_cd;
     }
    
  });
  }

  loadHrDetail(){
    return this.getInfoHrService.getHrDetail('basic',this.companyId,this.hrId);
  }
  onPathCarrerSubmit() {
    this.hrNewCareerService.insertHrPathCare(this.pathCareerInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.onReset();
        this.reloadParent();
      }
    })
  }
  onReset() {
    $("form.frmNewCare")
      .validate()
      .resetForm();
    this.hrNewCareerService.resetModel();
    this.pathCareerInfo = this.hrNewCareerService.getModel();
    this.pathCareerInfo.company_id = this.companyId;
    this.pathCareerInfo.hr_id = this.hrId;
  }
  reloadParent(){
    this.resetParent.emit();
  }
}
