import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { OrganizationMasterService } from '@app/core/services/features.services/organization-master.service';

import { Category, ProgramList } from '@app/core/common/static.enum';
import { HrBasicInfoModel } from '@app/core/models/hr/hr-basic-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HrBasicInfoService } from '@app/core/services/hr.services/hr-basic-info.service';
import { HrMainInfoModel } from '@app/core/models/hr/hr-main-info.model';
import { BasePage } from '@app/core/common/base-page';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { DutyTypeService } from '@app/core/services/hr.services/hr-mas-dutytype.service';

@Component({
  selector: 'sa-personal-basic',
  templateUrl: './personal-basic.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRPersonalBasicComponent extends BasePage implements OnInit {
  basicInfo : HrBasicInfoModel;
  org:any[] = [];
  salary:any[]=[];
  dutyType : any[] = [];
  dutyKind : any[] = [];
  class : any[] = [];
  workPlace : any[] = [];
  taxCode: any[] = [];
  dutyStatus : any[] = [];
  dutyStatusDetail : any[] = [];
  companyId:number=0;
  createdTime : string = '';
  hrId:string='';
  mainData : HrMainInfoModel;
  isStopwork:boolean=false;;
  entry_date = function (date){
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
  constructor(
    private api: CRMSolutionApiService,
    public userService: AuthService,
    private notification: NotificationService,
    private hrBasicInfoService: HrBasicInfoService,
    private generalMasterService: GeneralMasterService,
    private orgMasterService: OrganizationMasterService,
    public dutyTypeService: DutyTypeService,
    private router: Router,
    private modalService: BsModalService,
    ) {
    super(userService);
  }
  
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.basicInfo  = this.hrBasicInfoService.getModel();
    this.getOrg(this.loggedUser.company_id).then(data=>{
      this.org.push(...data)
    })
    this.getSalary().then(data=>{
      this.salary.push(...data)
    })
    this.getDutyType().then(data=>{
      this.dutyType.push(...data)
    })
    this.getClass().then(data=>{
      this.class.push(...data)
    })
    this.getDutyKind().then(data=>{
      this.dutyKind.push(...data)
    })
    this.getWorkPlace().then(data=>{
      this.workPlace.push(...data)
    })
    this.getTaxCode().then(data=>{
      this.taxCode.push(...data)
    })
    this.getDutyStatus().then(data=>{
      this.dutyStatus.push(...data)
    })
    this.getDutyStatusDetail().then(data=>{
      this.dutyStatusDetail.push(...data)
    })
   
  }

  getOrg(companyId){    
    return this.orgMasterService.listOrganization(companyId);
  }
  getSalary(){
    return this.generalMasterService.listGeneralByCate(Category.HRJobType.valueOf())
  }
  getDutyType(){
    return this.dutyTypeService.getDutyType();
  }
  getClass(){
    return this.generalMasterService.listGeneralByCate(Category.HRJobClass.valueOf())
  }
  getDutyKind(){
    return this.generalMasterService.listGeneralByCate(Category.DutyKind.valueOf())
  }
  getWorkPlace(){
    return this.generalMasterService.listGeneralByCate(Category.WorkPlace.valueOf())
  }
  getTaxCode(){
    return this.generalMasterService.listGeneralByCate(Category.TaxCode.valueOf())
  }
  getDutyStatus(){
    return this.generalMasterService.listGeneralByCate(Category.DutyStatus.valueOf())
  } 
  getDutyStatusDetail(){
    return this.generalMasterService.listGeneralByCate(Category.DutyStatusDetail.valueOf())
  } 
  getDataFromMain(mainData) {
    this.basicInfo = mainData;
    this.companyId=mainData.company_id;
    this.hrId=mainData.hr_id;
    this.createdTime = mainData.created_time;    
  }

  resetData(){
    
    this.onReset()
    this.basicInfo.created_time =null;
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      org_id: {
        required: true
      },
      job_type_gen_cd: {
        required: true
      },
      
    },
    // Messages for form validation
    messages: {
      org_id: {
        required: "Please enter"
      },
      job_type_gen_cd: {
        required: "Please enter"
      }
    }
  };

  onSubmit() {
    this.hrBasicInfoService.insertHrBasicInfo(this.basicInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
    })
  }

  onReset() {
     $("form.frmBasic")
    .validate()
    .resetForm();
    this.hrBasicInfoService.resetModel();
    this.basicInfo = this.hrBasicInfoService.getModel();
    
    this.basicInfo.created_time = this.createdTime;
    this.basicInfo.company_id = this.companyId;
    this.basicInfo.hr_id = this.hrId;
  }
  onDutyStatusChange(e){
    if(e=="530000000001"){
      this.isStopwork=true;
    }
    else{
      this.isStopwork=false;
    }
  }
}
