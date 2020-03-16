import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HrMainInfoModel } from '@app/core/models/hr/hr-main-info.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { HrMainInfoService } from '@app/core/services/hr.services/hr-main-info.service';
import { NotificationService } from '@app/core/services/notification.service';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { HrFamilyInfoService } from '@app/core/services/hr.services/hr-family-info.service';
import { HrAcademicInfoService } from '@app/core/services/hr.services/hr-academic-info.service';
import { HrLastCareerService } from '@app/core/services/hr.services/hr-last-career.service';
import { HrCetificateService } from '@app/core/services/hr.services/hr-cetificate.service';
import { HrRewardPunishInfoService } from '@app/core/services/hr.services/hr-reward-punish.service';
import { HrTraningInfoService } from '@app/core/services/hr.services/hr-traning-info.service';
import { HrMedicalInfoService } from '@app/core/services/hr.services/hr-medical-info.service';
import { HrAppraisalInfoService } from '@app/core/services/hr.services/hr-appraisal-info.service';
import { HrNewCareerService } from '@app/core/services/hr.services/hr-new-career.service';
import { HrFamilyInfoModel } from '@app/core/models/hr/hr-family-info.model';
import { HrAcademicInfoModel } from '@app/core/models/hr/hr-academic-info.model';
import { HrLastCareerModel } from '@app/core/models/hr/hr-last-career.model';
import { HrNewCareerModel } from '@app/core/models/hr/hr-new-career.model';
import { HrCetificateModel } from '@app/core/models/hr/hr-cetificate.model';
import { HrRewardPunishModel } from '@app/core/models/hr/hr-reward-punish.model';
import { HrTraningInfoModel } from '@app/core/models/hr/hr-traning-info.model';
import { HrMedicalInfoModel } from '@app/core/models/hr/hr-medical-info.model';
import { HrAppraisalInfoModel } from '@app/core/models/hr/hr-appraisal-info.model';
import { HrInsuranceInfoService } from '@app/core/services/hr.services/hr-insurance-info.service';
import { HrInsuranceInfoModel } from '@app/core/models/hr/hr-insurance-info.model';
// import * as XLSX from 'xlsx';
import { HrPrintingService } from '@app/core/services/hr.services/hr-printing.service';
import { HrPrintingModel } from '@app/core/models/hr/hr-printing.model';
import { DutyTypeService } from '@app/core/services/hr.services/hr-mas-dutytype.service';
import { DutyTypeModel } from '@app/core/models/hr/hr-mas-duty-type.model';


@Component({
  selector: 'sa-employee-print',
  templateUrl: './employee-print.component.html',
  styleUrls: ['./employee-print.component.css']
})
export class EmployeePrintComponent extends BasePage implements OnInit {
  mainInfo: HrMainInfoModel;
  DutyType: any[]=[];
  EmployeePrintTable: any;
  PrintingInfo: HrPrintingModel = new HrPrintingModel()
  familyInfo: any;
  academicInfo: any;
  beforeCareer: any;
  afterCareer: any;
  certificateInfo: any;
  rewardInfo: any;
  trainingInfo: any;
  medicalInfo: any;
  appraisalInfo: any;

  isCreated: boolean;

  dutyStatus: GeneralMasterModel[] = [];
  dutyKind: GeneralMasterModel[] = [];
  workPlace: GeneralMasterModel[] = [];
  schoolClass: GeneralMasterModel[] = [];
  graduateType: GeneralMasterModel[] = [];
  certificate: GeneralMasterModel[] = [];
  certificateType: GeneralMasterModel[] = [];
  salaryCode: GeneralMasterModel[] = [];
  period: GeneralMasterModel[] = [];
  contribution: GeneralMasterModel[] = [];
  result: GeneralMasterModel[] = [];
  capability: GeneralMasterModel[] = [];
  PathCareer: GeneralMasterModel[] = [];
  Org: any[] = [];
  TaxCode: GeneralMasterModel[] = [];;
  HRClass: GeneralMasterModel[] = [];;
  TrainingType: GeneralMasterModel[] = [];
  Organizer: GeneralMasterModel[] = [];
  Relation: GeneralMasterModel[] = [];
  insurance: GeneralMasterModel[] = [];

  @ViewChild('table') table: ElementRef;

  row5: any[] = [1, 2, 3, 4, 5]
  row10: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  row20: any[] = []
  row25: any[] = []
  row45: any[] = []

  insurance1: any = '';
  insurance2: any = '';
  insurance3: any = '';

  constructor(
    private orgMasterService: OrganizationMasterService,
    private hrMainInfoService: HrMainInfoService,
    private notification: NotificationService,
    public userService: AuthService,
    private generalMasterService: GeneralMasterService,
    private hrFamilyInfoService: HrFamilyInfoService,
    private hrAcademicInfoService: HrAcademicInfoService,
    private hrLastCareerService: HrLastCareerService,
    private hrNewCareerService: HrNewCareerService,
    private hrCetificateService: HrCetificateService,
    private hrRewardPunishInfoService: HrRewardPunishInfoService,
    private hrTraningInfoService: HrTraningInfoService,
    private hrMedicalInfoService: HrMedicalInfoService,
    private hrAppraisalInfoService: HrAppraisalInfoService,
    public programService: ProgramService,
    private hrInsuranceInfoService: HrInsuranceInfoService,
    private HrPrintingService: HrPrintingService,
    private DutyTypeService: DutyTypeService
  ) {
    super(userService);
  }

  initModel() {
    this.mainInfo = this.hrMainInfoService.getModel();
    this.mainInfo.company_id = this.companyInfo.company_id;
    this.PrintingInfo.company_id = this.companyInfo.company_id;


  }
  ngOnInit() {

    this.initModel();
    this.getDutyType().then(data => {
      this.DutyType.push(...data)
    });
   
    this.getDutyKind().then(data => {
      this.dutyKind.push(...data)
    })
    this.getDutyStatus().then(data => {
      this.dutyStatus.push(...data)
    })
    this.getOrg(this.mainInfo.company_id).then(data => {
      this.Org.push(...data)
    })
    this.getWorkPlace().then(data => {
      this.workPlace.push(...data);
    })
    this.getSalary().then(data => {
      this.salaryCode.push(...data);
    })
    this.getSchool().then(data => {
      this.schoolClass.push(...data)
    })
    this.getGraduateType().then(data => {
      this.graduateType.push(...data)
    })

    this.getCertificate().then(data => {
      this.certificate.push(...data);
    });
    this.getCertificateType().then(data => {
      this.certificateType.push(...data);
    });
    this.getPeriod().then(data => {
      this.period.push(...data)
    })
    this.getContribution().then(data => {
      this.contribution.push(...data)
    })
    this.getResult().then(data => {
      this.result.push(...data)
    })
    this.getCapability().then(data => {
      this.capability.push(...data)
    })
    this.getPathCareer().then(data => {
      this.PathCareer.push(...data)
    });
    this.getHRClass().then(data => {
      this.HRClass.push(...data)
    });
    this.getTaxCode().then(data => {
      this.TaxCode.push(...data)
    });
    this.getOrganizer().then(data => {
      this.Organizer.push(...data);
    });
    this.getTrainingType().then(data => {
      this.TrainingType.push(...data);
    });
    this.getRelation().then(data => {
      this.Relation.push(...data);
    });
    this.getInsurance().then(data => {
      this.insurance.push(...data);
    });
    // for (var i = 1; i <= 45; i++) {
    //   this.row45.push(i);
    // }
    // for (var i = 1; i <= 25; i++) {
    //   this.row25.push(i);
    // }
    // for (var i = 1; i <= 20; i++) {
    //   this.row20.push(i);
    // }
  }

  getInsurance() {
    return this.generalMasterService.listGeneralByCate(Category.InsuranceType.valueOf())
  }
  getRelation() {
    return this.generalMasterService.listGeneralByCate(Category.FamilyRelationship.valueOf())
  }
  getPathCareer() {
    return this.generalMasterService.listGeneralByCate(Category.CareerPathType.valueOf())
  }
  getSalary() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobType.valueOf())
  }
  private getWorkPlace() {
    return this.generalMasterService.listGeneralByCate(Category.WorkPlace.valueOf());
  }
  private getDutyType() {
    return this.DutyTypeService.getDutyType()
  }
  getOrg(companyId) {
    return this.orgMasterService.listOrganization(companyId);
  }
  private getDutyStatus() {
    return this.generalMasterService.listGeneralByCate(Category.DutyStatus.valueOf())
  }
  private getDutyKind() {
    return this.generalMasterService.listGeneralByCate(Category.DutyKind.valueOf())
  }
  getSchool() {
    return this.generalMasterService.listGeneralByCate(Category.SchoolType.valueOf())
  }
  getGraduateType() {
    return this.generalMasterService.listGeneralByCate(Category.SchoolGraduatedType.valueOf())
  }
  getCertificate() {
    return this.generalMasterService.listGeneralByCate(Category.Certificate.valueOf())
  }
  getCertificateType() {
    return this.generalMasterService.listGeneralByCate(Category.CertificateType.valueOf())
  }

  getHRClass() {
    return this.generalMasterService.listGeneralByCate(Category.HRJobClass.valueOf())
  }
  getTaxCode() {
    return this.generalMasterService.listGeneralByCate(Category.TaxCode.valueOf())
  }
  getPeriod() {
    return this.generalMasterService.listGeneralByCate(Category.AppraisalPeriod.valueOf())
  }
  getContribution() {
    return this.generalMasterService.listGeneralByCate(Category.AppraisalType.valueOf())
  }
  getResult() {
    return this.generalMasterService.listGeneralByCate(Category.AppraisalResultType.valueOf())
  }
  getCapability() {
    return this.generalMasterService.listGeneralByCate(Category.AppraisalCapabilityLevel.valueOf())
  }
  getOrganizer() {
    return this.generalMasterService.listGeneralByCate(Category.OrganizerType.valueOf());
  }
  getTrainingType() {
    return this.generalMasterService.listGeneralByCate(Category.TrainingType.valueOf());
  }
  getDutyTypesName(Id) {
    var d = this.DutyType.filter(x => x.dutytypeid == Id);
    if (d.length > 0) {
      return d[0].dutytypenm;
    }
    return '';
  }
  getDutyKindName(Id) {
    var k = this.dutyKind.filter(x => x.gen_cd == Id);
    if (k.length > 0) {
      return k[0].gen_nm
    }
    return '';
  }
  getDutyStatusName(Id) {
    var s = this.dutyStatus.filter(x => x.gen_cd == Id);
    if (s.length > 0) {
      return s[0].gen_nm
    }
    return '';
  }
  getOrgName(Id) {
    var o = this.Org.filter(x => x.org_cd == Id);
    if (o.length > 0) {
      return o[0].org_nm_eng
    }
    return '';
  }
  getWorkPlaceName(Id) {
    var w = this.workPlace.filter(x => x.gen_cd == Id);
    if (w.length > 0) {
      return w[0].gen_nm
    }
    return '';
  }
  getSalaryCodeName(Id) {
    var c = this.salaryCode.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getSchoolClassName(Id) {
    var c = this.schoolClass.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getGradName(Id) {
    var c = this.graduateType.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getCertificateName(Id) {
    var c = this.certificate.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }

  getcertificateType(Id) {
    var c = this.certificateType.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getPeriodName(Id) {
    var c = this.period.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }

  getContributionName(Id) {
    var c = this.contribution.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getResultName(Id) {
    var c = this.result.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getCapabilityName(Id) {
    var c = this.capability.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getPathName(Id) {
    var c = this.PathCareer.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getClassName(Id) {
    var c = this.HRClass.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getTaxName(Id) {
    var c = this.TaxCode.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getTrainingName(Id) {
    var c = this.TrainingType.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getOrganizerName(Id) {
    var c = this.Organizer.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }
  getRelationName(Id) {
    var c = this.Relation.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }

  getInsuranceName(Id) {
    var c = this.insurance.filter(x => x.gen_cd == Id);
    if (c.length > 0) {
      return c[0].gen_nm
    }
    return '';
  }

  print() {
    //var w=window.open();
    var w = window.open('', '_blank', 'width=1200,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    //  w.document.write( "<link rel=\"stylesheet\" href=\"http://localhost:4200/assets/css/employee-print-style.css\" type=\"text/css\" media=\"print\"/>" );
    //   w.document.write($("#printTable").html());0
    let htmlBody = $("#printTable").html();
    console.log("html", htmlBody)
    w.document.write('<html><head><link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css" /><link rel="stylesheet" type="text/css" href="/assets/css/employee-print-style.css" /></head><body>' + htmlBody + '</body></html>');
    //w.print();
    //w.close();
  }

  exportToExcel() {
    // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // /* save to file */
    // XLSX.writeFile(wb, 'EmployeeInfo.xlsx');

  }

  searchData() {
    let txtHr = $("#txtHrId").val();
    let txtEplName = $("#txtEplName").val();
    if (txtHr != '' || txtEplName != '') {
      this.hrMainInfoService.listEmployeePrint(this.mainInfo.company_id, txtHr, txtEplName).then(data => {
        if (data.length == 0) {
          this.notification.showError("HR ID " + txtHr + " not found")
          this.isCreated = false;
        }
        else {
          this.isCreated = true;
          this.mainInfo = data[0];
          this.hrFamilyInfoService.listFamily(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.familyInfo = data;
            if (this.familyInfo.length < 10) {
              for (var i = this.familyInfo.length; i < 10; i++) {
                this.familyInfo.push({})
              }
            }
          })
          this.hrAcademicInfoService.listAcademic(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.academicInfo = data;
            if (this.academicInfo.length < 10) {
              for (var i = this.academicInfo.length; i < 10; i++) {
                this.academicInfo.push({})
              }
            }
          })
          this.hrLastCareerService.listlastCare(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.beforeCareer = data;
            if (this.beforeCareer.length < 5) {
              for (var i = this.beforeCareer.length; i < 5; i++) {
                this.beforeCareer.push(new HrLastCareerModel())
              }
            }
          })
          this.hrNewCareerService.listPathCare(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.afterCareer = data;
            if (this.afterCareer.length < 20) {
              for (var i = this.afterCareer.length; i < 20; i++) {
                this.afterCareer.push(new HrNewCareerModel())
              }
            }
          })
          this.hrCetificateService.listCertificate(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.certificateInfo = data;
            if (this.certificateInfo.length < 5) {
              for (var i = this.certificateInfo.length; i < 5; i++) {
                this.certificateInfo.push(new HrCetificateModel())
              }
            }
          })
          this.hrRewardPunishInfoService.listRewardPunish(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.rewardInfo = data;
            if (this.rewardInfo.length < 45) {
              for (var i = this.rewardInfo.length; i < 45; i++) {
                this.rewardInfo.push(new HrRewardPunishModel())
              }
            }
          })
          this.hrTraningInfoService.listTraining(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {

            this.trainingInfo = data;
            if (this.trainingInfo.length < 45) {
              for (var i = this.trainingInfo.length; i < 45; i++) {
                this.trainingInfo.push({});
              }
            }
          })
          this.hrMedicalInfoService.listMedical(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {

            this.medicalInfo = data;
            if (this.medicalInfo.length < 10) {
              for (var i = this.medicalInfo.length; i < 10; i++) {
                this.medicalInfo.push({})
              }
            }
          })
          this.hrAppraisalInfoService.listAppraisal(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            this.appraisalInfo = data;
            if (this.appraisalInfo.length < 10) {
              for (var i = this.appraisalInfo.length; i < 10; i++) {
                this.appraisalInfo.push({})
              }
            }
          })

          this.hrInsuranceInfoService.listInsurance(this.mainInfo.company_id, this.mainInfo.hr_id).then(data => {
            //this.insurance = data;
            var count = data.length;
            if (count > 0) {
              console.log("this.insurance", count, data[0])
              if (count == 1) {
                this.insurance1 = this.getInsuranceName(data[0].insurance_gen_cd) + " - " + data[0].insurance_no
              }
              if (count == 2) {
                this.insurance1 = this.getInsuranceName(data[0].insurance_gen_cd) + " - " + data[0].insurance_no
                this.insurance2 = this.getInsuranceName(data[1].insurance_gen_cd) + " - " + data[1].insurance_no
              }
              if (count >= 3) {
                this.insurance1 = this.getInsuranceName(data[0].insurance_gen_cd) + " - " + data[0].insurance_no
                this.insurance2 = this.getInsuranceName(data[1].insurance_gen_cd) + " - " + data[1].insurance_no
                this.insurance3 = this.getInsuranceName(data[2].insurance_gen_cd) + " - " + data[2].insurance_no
              }
            }
          })
        }
      })
    }
  }

  InsertPrintEpl() {
    this.HrPrintingService.insertHrPrinting(this.PrintingInfo).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
    });
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
