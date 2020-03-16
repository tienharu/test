import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { HrSalaryModel, HeaderModel } from '@app/core/models/hr/hr-salary.model';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { HrSalaryService } from '@app/core/services/hr.services/hr-salary.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import 'datejs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserModel } from '@app/core/models/user.model';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'sa-salary-register',
  templateUrl: './salary-register.component.html',
  styleUrls: ['./salary-register.component.css'],
})

export class SalaryRegisterComponent extends BasePage implements OnInit {
  salaryInfo: HrSalaryModel = new HrSalaryModel();
  headerModel: HeaderModel;
  yearMonths: any[] = [];
  isSelected: boolean = false;
  jobTypes: GeneralMasterModel[] = [];
  jobClass: GeneralMasterModel[] = [];
  options: any;
  salary: HrSalaryModel[] = [];
  modalRef: BsModalRef;
  userInfo: UserModel;
  lastMonthData : any;


  @ViewChild("popupUpdateSalary") popupUpdateSalary;
  @ViewChild("popupCreateSalary") popupCreateSalary;
  constructor(
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private hrSalaryService: HrSalaryService,
    private modalService: BsModalService,
    public programService: ProgramService,
    public userService: AuthService, ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Basic_Salary_Master.valueOf());
    this.userInfo = this.userService.getUserInfo();
    this.salaryInfo.company_id = this.companyInfo.company_id;
    this.initDatatable();
    this.getJobTypes().then(data => {
      this.jobTypes.push(...data);
    });
    this.getJobClass().then(data => {
      this.jobClass.push(...data);
    });
    this.headerModel = new HeaderModel();
    this.getTime(this.salaryInfo.company_id).then(data => {
      this.yearMonths = data.yearmonth;
      this.lastMonthData = data.yearmonth[0];
      if(this.yearMonths.length>0){
        this.headerModel.month_year=this.lastMonthData.sbtyear+"-"+this.lastMonthData.sbtmonth;
        console.log(this.headerModel.month_year)
        this.searchData();
        //$(".month-year").select2().trigger("change")
      }
      else{
        //no salary table?
        this.notification.showMessage("info", 'There is no standard salary table');
      }
    });
  }

  private getJobTypes() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobType.valueOf())
  }
  private getJobClass() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobClass.valueOf())
  }
  getTime(company_id) {
    return this.hrSalaryService.listTime(company_id)
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrSalaryService.listSalary(this.companyInfo.company_id, this.headerModel.jobTypeId, this.headerModel.jobClassId, this.headerModel.month, this.headerModel.year).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var o = this.jobTypes.filter(x => x.gen_cd === data.job_type_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.jobClass.filter(x => x.gen_cd === data.job_class_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { 
          data: (data, type, dataToSet) => {
            return CommonFunction.FormatMoney(data.sbt_basic_amt);
          }, className: "right", width: "80px" },
        { 
          data: (data, type, dataToSet) => {
            return CommonFunction.FormatMoney(data.sbt_1_atm);
          },
         className: "right", width: "80px" },
        { data: (data, type, dataToSet) => {
          return CommonFunction.FormatMoney(data.sbt_2_atm);
        },
         className: "right", width: "80px" },
        { data: (data, type, dataToSet) => {
          return CommonFunction.FormatMoney(data.sbt_3_atm);
        },
         className: "right", width: "80px" },
        { data: "creator", className: "center", width: "80px" },
        { data: "created_time", className: "center", width: "80px" },
        { data: "remark", className: "", width: "300px" },
      ],
      scrollY: 550,
      scrollX: false,
      paging: false,
      buttons: [
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  searchData() {
    var ym=this.headerModel.month_year.split('-');
    this.headerModel.year=parseInt(ym[0]);
    this.headerModel.month=parseInt(ym[1]);
    this.reloadDatatable()
  }

  onRowClick(event) {
    setTimeout(() => {
      this.salaryInfo = event;
      console.log("event", this.salaryInfo)
    }, 100);
    // var f = $("form.frm-detail").validate();
    // if (!f.valid()) {
    //   f.resetForm();
    // }
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.hrSalaryService.resetModel();
    this.salaryInfo = this.hrSalaryService.getModel();
    this.salaryInfo.company_id = this.companyInfo.company_id;
  }

  private reloadDatatable() {
    $(".salaryListInfo")
      .DataTable()
      .ajax.reload();
  }

  onSubmit() {
    this.hrSalaryService.updateSalaryInfo(this.salaryInfo).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadDatatable();
      }
    });
  }

  openSalaryUpdatePopup(salary) {
    setTimeout(() => {
      this.salaryInfo = salary;
      let config = {
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalRef = this.modalService.show(this.popupUpdateSalary, config);
    }, 100);
  }

  openSalaryCreatePopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.getTime(this.companyInfo.company_id).then(data => {
      this.yearMonths = data.yearmonth;
    });
    this.modalRef = this.modalService.show(this.popupCreateSalary, config);
  }
  
  closeCreateSalaryPopup() {
    this.getTime(this.companyInfo.company_id).then(data => {
      this.yearMonths = data.yearmonth;
      this.lastMonthData = data.yearmonth[0];
    });
    this.modalRef && this.modalRef.hide();
    
  }

  closeSalaryPopup() {
    this.modalRef && this.modalRef.hide();
    this.reloadDatatable();
    
  }

  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}

