import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

import { HrMainInfoModel, EmployeeExtraInfo, HrListSearchModel } from '@app/core/models/hr/hr-main-info.model';
import { HrMainInfoService } from '@app/core/services/hr.services/hr-main-info.service';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { AuthService } from '@app/core/services/auth.service';

import { OrganizationMasterService } from '@app/core/services/features.services/organization-master.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BasePage } from '@app/core/common/base-page';

import { LayoutService } from '@app/core/services/layout.service'
import { HRPersonalBasicComponent } from '../sub-info/personal-basic/personal-basic.component';
import { HRFamilyInfoComponent } from '../sub-info/family-info/family-info.component';
import { HRAcademicInfoComponent } from '../sub-info/academic-info/academic-info.component';
import { HRCareerInfoComponent } from '../sub-info/career-info/career-info.component';
import { HRRewardPunishComponent } from '../sub-info/reward-punish/reward-punish.component';
import { HRTraningInfoComponent } from '../sub-info/traning-info/traning-info.component';
import { HRMedicalInfoComponent } from '../sub-info/medical-info/medical-info.component';
import { HRAppraisalInfoComponent } from '../sub-info/appraisal-info/appraisal-info.component';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Router } from '@angular/router';
import { InsuranceDataComponent } from '../sub-info/insurance-data/insurance-data.component';
import { ProgramService } from '@app/core/services/program.service';
import { MaternityInfoComponent } from '../sub-info/maternity-info/maternity-info.component';
@Component({
  selector: 'sa-main-info',
  templateUrl: './main-info2.component.html',
  styleUrls: ['./main-info2.component.css']
})
export class HRMainInfoComponent extends BasePage implements OnInit {
  @ViewChild(HRPersonalBasicComponent) hrBasicycpm: HRPersonalBasicComponent;
  @ViewChild(HRFamilyInfoComponent) hrFamilycpm: HRFamilyInfoComponent;
  @ViewChild(HRAcademicInfoComponent) hrAcademiccpm: HRAcademicInfoComponent;
  @ViewChild(HRCareerInfoComponent) hrCareercpm: HRCareerInfoComponent;
  @ViewChild(HRRewardPunishComponent) hrRewardcpm: HRRewardPunishComponent;
  @ViewChild(HRTraningInfoComponent) hrTraningcpm: HRTraningInfoComponent;
  @ViewChild(HRMedicalInfoComponent) hrMedicalcpm: HRMedicalInfoComponent;
  @ViewChild(HRAppraisalInfoComponent) hrAppraisalcpm: HRAppraisalInfoComponent;
  @ViewChild(InsuranceDataComponent) hrInsuranceData: InsuranceDataComponent;
  @ViewChild(MaternityInfoComponent) hrMaternityInfo: MaternityInfoComponent;

  // @ViewChild("popupInsuranceData") popupInsuranceData;
  @ViewChild("popupContractData") popupContractData;
  modalRef: BsModalRef;
  userLogin: any;
  options: any;
  mainInfo: HrMainInfoModel;
  countryCode: any[] = [];
  org: any[] = [];
  jobType: any[] = [];
  dutyType: any[] = [];
  placeOfBirth: any[] = [];
  listTab: any[] = [];
  bkSubdata: string = 'basic';
  company: any = [];
  extraInfo: EmployeeExtraInfo = new EmployeeExtraInfo();
  isUpdating: boolean = false;
  isAutoGenHrID: boolean = false;
  isCreatedOrUpdating: boolean = false;//for open contract popup
  //isAutoMaternity: boolean = false;

  searchModel:HrListSearchModel;

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private hrMainInfoService: HrMainInfoService,
    private generalMasterService: GeneralMasterService,
    private orgMasterService: OrganizationMasterService,
    private modalService: BsModalService,
    private layoutService: LayoutService,
    public userService: AuthService,
    private i18nService: I18nService,
    private router: Router,
    public programService: ProgramService,
  ) {
    super(userService);
  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      employee_nm: {
        required: true
      },
      employee_nm_simple: {
        required: true
      },
      entrance_ymd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      employee_nm: {
        required: "Please enter fullname"
      },
      employee_nm_simple: {
        required: "Please enter display name"
      },
      entrance_ymd: {
        required: "Entrance date is required"
      }
    }
  };

  onFileChange(event) {
    const reader = new FileReader();
    // console.log(event.target.files);
    if (event.target.files && event.target.files.length) {
      //const [file] = event.target.files;     
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        $('#profileImage').attr('src', reader.result);//.width(150).height(200);    

        this.mainInfo.image_data = {
          file_name: file.name,
          file_type: file.type,
          value: reader.result.toString()
        };
      }
    }
    else {
      this.mainInfo.image_data = null;
    }
  }

  onOpenFile(event) {
    $('#file-upload').click();
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.company.push(this.companyInfo)
    this.mainInfo = this.hrMainInfoService.getModel();
    this.mainInfo.company_id = this.companyInfo.company_id;

    this.searchModel=new HrListSearchModel();
    this.searchModel.company_id=this.companyInfo.company_id;
    //
    this.getOrg(this.loggedUser.company_id).then(data => {
      this.org.push(...data)
    })
    this.getCountryCode().then(data => {
      this.countryCode.push(...data)
    })
    this.getplaceOfBirth().then(data => {
      this.placeOfBirth.push(...data);
    })
    this.getJobType().then(data => {
      this.jobType.push(...data)
    })
    // $('.main-ymd-datepicker').datepicker({
    //   dateFormat: 'yy-mm-dd',
    //   onSelect: (selectedDate) => {
    //     this.mainInfo.birth_ymd=selectedDate;
    //   }
    // });
    this.userLogin = this.userService.getUserInfo();
  }
  ngAfterContentInit() {
    this.initDatatable();
  }
  getOrg(companyId) {
    return this.orgMasterService.listOrganization(companyId);
  }
  getCountryCode() {
    return this.generalMasterService.listGeneralByCate(Category.CountryCateCode.valueOf())
  }
  getplaceOfBirth() {
    return this.generalMasterService.listGeneralByCate(Category.PlaceOfBirth.valueOf())
  }
  getJobType() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobType.valueOf())
  }
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrMainInfoService.listAllHR(this.searchModel.company_id,this.searchModel.departId,this.searchModel.keyword,this.searchModel.filterStatus,this.searchModel.from,this.searchModel.to).then(data => {
          callback({
            aaData: data.data
          });
        })
      },
      columns: [
        { data: "hr_id", className: "center", width: "100px" },
        { data: "national_id", className: "", width: "70px" },
        { data: "employee_nm", className: "", width: "150px" },
        { data: "entrance_ymd", className: "center", width: "100px" },
        {
          data: (data) => {
            var c = this.org.filter(
              x => x.org_cd === data.org_id
            );
            if (c.length > 0) return c[0].org_nm_eng;
            else return "N/A";
          }, className: "", width: "150px"
        },
        {
          data: (data) => {
            var c = this.jobType.filter(
              x => x.gen_cd === data.job_type_gen_cd
            );
            if (c.length > 0) return c[0].gen_nm;
            else return "N/A";
          }, className: "", width: "150px"
        },
        { data: "phone", className: "" },
        {
          data: (data, type, dataToSet) => {
            if (data.gender == 1) return 'Male';
            else return "Female";
          }, className: "center", width: "100px"
        },
        { data: "birth_ymd", className: "center", width: "100px" },
        // {
        //   data: (data) => {
        //     var c = this.countryCode.filter(
        //       x => x.gen_cd === data.birth_country_gen_cd
        //     );
        //     if (c.length > 0) return c[0].gen_nm;
        //     else return "N/A";
        //   }, className: "center", width: "100px"
        // },

        { data: "changer", className: "center", width: "80px" },
        { data: "changed_time", className: "center", width: "80px" },
        { data: "creator", className: "center", width: "80px" },
        { data: "created_time", className: "center", width: "80px" },
      ],
      scrollY: 240,
      scrollX: true,
      paging: true,
      pageLength: 25,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.callResetChild(this.bkSubdata);
            dt.ajax.reload((x) => { }, false);
            this.mainInfo = new HrMainInfoModel();
            this.mainInfo.company_id = this.companyInfo.company_id;
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-trash text-danger canDelete" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if (!this.permission.canDelete) {
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.employee_nm;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrMainInfoService.DeleteHrMainInfo(this.mainInfo).then(data => {
                      if (data.error) {
                        this.notification.showMessage("error", data.error.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          data.message
                        );
                        this.reloadDatatable();
                      }
                    })
                  }
                }
              );
            }
          }
        },
        "copy",
        "csv",
        "pdf",
        "print"
      ]
    };
  }
  onRowClick(event) {
    // console.log("this.permission.canDelete",this.permission.canDelete)
    // if (!this.permission.canDelete) {
    //   $('a.buttons-selected').addClass('disabled');
    //   // event.preventdefault();
    // }
    this.isUpdating = true;
    this.isCreatedOrUpdating = true;
    setTimeout(() => {
      this.mainInfo = event;
      if(this.bkSubdata=='maternity'){
        this.bkSubdata='basic';
        $("#personal-basic").trigger('click')
      }
      this.callChild(this.bkSubdata)
    }, 100);

    this.hrMainInfoService.getExtraInfo(event.company_id, event.hr_id).then(data => {
      this.extraInfo = data;
    })
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
  }
  //
  callChild(subdata: string) {
    if (this.mainInfo.hr_id) {
      let companyID: number = this.mainInfo.company_id;
      let hrID: string = this.mainInfo.hr_id;
      this.bkSubdata = subdata;
      switch (subdata) {
        case 'basic':
          this.hrBasicycpm.getDataFromMain(this.mainInfo);
          break;
        case 'family':
          this.hrFamilycpm.getDataFromMain(companyID, hrID);
          break;
        case 'academic':
          this.hrAcademiccpm.getDataFromMain(companyID, hrID);
          break;
        case 'career':
          this.hrCareercpm.getDataFromMain(companyID, hrID);
          break;
        case 'reward-punish':
          this.hrRewardcpm.getDataFromMain(companyID, hrID);
          break;
        case 'training':
          this.hrTraningcpm.getDataFromMain(companyID, hrID);
          break;
        case 'medical':
          this.hrMedicalcpm.getDataFromMain(companyID, hrID);
          break;
        case 'appraisal':
          this.hrAppraisalcpm.getDataFromMain(companyID, hrID);
          break;
        case 'insurance':
          this.hrInsuranceData.getDataFromMain(companyID, hrID);
          break;
        case 'maternity':
          this.hrMaternityInfo.getDataFromMain(companyID, hrID);
          break;
        default:
          break;
      }
    }
  }
  setDisplayName() {
    //nếu là thêm mới Employee thì gán
    !this.mainInfo.hr_id ? this.mainInfo.employee_nm_simple = this.mainInfo.employee_nm : ''
  }
  onSubmit() {
    this.hrMainInfoService.insertHrMainInfo(this.mainInfo, this.isAutoGenHrID).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.hrMainInfoService.resetModel();
        this.mainInfo = this.hrMainInfoService.getModel();
        this.mainInfo.company_id = this.companyInfo.company_id;
        $('#profileImage').attr('src', '/assets/img/epl_avatar.jpg');
        this.reloadDatatable();
        this.isCreatedOrUpdating = true;
      }
    })
  }
  onReset(f: NgForm) {
    this.isUpdating = false;
    //gọi xóa child
    this.callResetChild(this.bkSubdata);
    //this.reloadDatatable();
    $(".eplList").DataTable().rows({ selected: true }).deselect();
    $("form.frm-detail")
      .validate()
      .resetForm();

    this.hrMainInfoService.resetModel();
    this.mainInfo = this.hrMainInfoService.getModel();
    this.mainInfo.company_id = this.companyInfo.company_id;
    this.isCreatedOrUpdating = false;
    $('#profileImage').attr('src', '/assets/img/epl_avatar.jpg');
  }

  callResetChild(child: string) {
    if (this.mainInfo.hr_id) {
      switch (child) {
        case 'basic':
          this.hrBasicycpm.resetData();
          break;
        case 'family':
          this.hrFamilycpm.resetData();
          break;
        case 'academic':
          this.hrAcademiccpm.resetData();
          break;
        case 'career':
          this.hrCareercpm.resetData();
          break;
        case 'reward-punish':
          this.hrRewardcpm.resetData();
          break;
        case 'training':
          this.hrTraningcpm.resetData();
          break;
        case 'medical':
          this.hrMedicalcpm.resetData();
          break;
        case 'appraisal':
          this.hrAppraisalcpm.resetData();
          break;
        case 'insurance':
          this.hrInsuranceData.resetData();
          break;
          case 'maternity':
          this.hrMaternityInfo.resetData();
          break;
        default:
          break;
      }
    }
  }

  private reloadDatatable() {
    $(".eplList")
      .DataTable()
      .ajax.reload((x) => { }, false);
  }
  onPregnantChanged(e){
    console.log(e)
    if(e==true && this.bkSubdata!='maternity'){
      this.bkSubdata='maternity';
      $("#maternity-info").trigger('click')
      this.callChild(this.bkSubdata)
    }
    else if(e==false && this.bkSubdata=='maternity'){
      this.bkSubdata='basic';
      $("#personal-basic").trigger('click')
      this.callChild(this.bkSubdata)
    }
    
  }
  // openInsurancePopup() {
  //   if(!this.mainInfo.hr_id || this.mainInfo.hr_id==''){
  //     this.notification.showMessage("warning", 'Please select an employee!');
  //     return;
  //   }
  //   let config = {
  //     keyboard: true,
  //     backdrop: true,
  //     ignoreBackdropClick: true
  //   };

  //   this.modalRef = this.modalService.show(this.popupInsuranceData, config);
  // }

  // closeInsurancePopup() {
  //   this.modalRef && this.modalRef.hide();
  // }
  //-----
  openContractPopup() {
    if (!this.isCreatedOrUpdating) {
      this.notification.showMessage("warning", 'Cannot open contract information now!');
      return;
    }
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.modalRef = this.modalService.show(this.popupContractData, config);
  }

  closeContractPopup() {
    this.modalRef && this.modalRef.hide();

    this.hrMainInfoService.getExtraInfo(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
      this.extraInfo = data;
    })
  }

  onAutoGenIDChanged(e) {
    var v = e.currentTarget.checked;
    this.isAutoGenHrID = v;
    if (v) {
      $("input[name='hr_id']").prop('disabled', true).addClass('disabled').attr('placeholder', 'Auto Generate');
    }
    else {
      $("input[name='hr_id']").prop('disabled', false).removeClass('disabled').attr('placeholder', '...');
    }
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
  searchEmployee(){
    this.reloadDatatable();
  }
  exportExcelEmployee(){
    this.notification.showCenterLoading();
    this.hrMainInfoService.listEmployeeToExcel(this.searchModel.company_id,this.searchModel.departId,this.searchModel.keyword,this.searchModel.filterStatus,this.searchModel.from,this.searchModel.to).then(res=>{
        this.notification.hideCenterLoading();
    });
  }
}
