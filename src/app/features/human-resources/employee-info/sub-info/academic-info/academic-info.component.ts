import { Component, OnInit } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HrAcademicInfoService } from '@app/core/services/hr.services/hr-academic-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrAcademicInfoModel } from '@app/core/models/hr/hr-academic-info.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { NgForm } from '@angular/forms';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BasePage } from '@app/core/common/base-page';
import { AuthService } from '@app/core/services';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-academic-info',
  templateUrl: './academic-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRAcademicInfoComponent extends BasePage implements OnInit {

  academicInfo: HrAcademicInfoModel;
  school: any[] = [];
  graduateType: any[] = [];
  diplomaLevel: any[] = [];
  options: any;
  companyId: number = 0;
  hrId: string = '';
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrAcademicInfoService: HrAcademicInfoService,
    private generalMasterService: GeneralMasterService,
    private i18nService:I18nService,
    public userService: AuthService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }
  translate = function(property: string) {
    return this.otherService.translate(property);
  };
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.academicInfo = this.hrAcademicInfoService.getModel();
    this.initDatatable();
   
  }
  //
  getSchool() {
    return this.generalMasterService.listGeneralByCate(Category.SchoolType.valueOf())
  }
  getGraduateType() {
    return this.generalMasterService.listGeneralByCate(Category.SchoolGraduatedType.valueOf())
  }
  getDiplomaLevel() {
    return this.generalMasterService.listGeneralByCate(Category.DiplomaLevel.valueOf())
  }
  //
  getDataFromMain(companyID: number, hrID: string) {
    if (this.companyId === 0) {
      this.getSchool().then(data => {
        this.school.push(...data)
      })
      this.getGraduateType().then(data => {
        this.graduateType.push(...data)
      })
      this.getDiplomaLevel().then(data => {
        this.diplomaLevel.push(...data)
      })
      this.companyId = companyID;
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
    else{
      this.hrId = hrID;
    }

    if (this.hrIdBK !== hrID) {
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }

  }
  resetData(){
    this.hrAcademicInfoService.resetModel();
    this.academicInfo = this.hrAcademicInfoService.getModel();
    $(".eplAcademicInfoList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      school_type_gen_cd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      school_type_gen_cd: {
        required: "Please enter"
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrAcademicInfoService.listAcademic(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        { data: "school_nm", className: "", width: "100px" },
        {
          data: (data) =>{
            var c = this.diplomaLevel.filter(
              x => x.gen_cd === data.diploma_level_gen_cd
            );
            if(c.length > 0) return c[0].gen_nm; 
            else return "N/A"
          }, className: "center", width: "100px"
        },
        { data: "graduated_ymd", className: "center", width: "100px" },
        {
          data: (data) =>{
            if(data.graduated_type_cd === 1) return "Drop"
            else return "Out"
          },className:'center', width: "100px"
        },
        { data: "major_nm", className: "", width: "100px" },
        { data: "doctorate_nm", className: "", width: "150px" },
        { data: "remark", className: "", width: "150px" }
      ],
      //scrollY: 210,
      scrollX: true,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.onReset();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-trash text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.school_nm;
              this.notification.confirmDialog(
                "Delete System-menu Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrAcademicInfoService.DeleteHrAcademicInfo(this.academicInfo).then(data => {
                      if (data.error) {
                        this.notification.showMessage("error", data.error.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          data.message
                        );
                        this.onReset();
                      }
                    })
                  }
                }
              );
            }
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }
  //
  onRowClick(event) {
    setTimeout(() => {
      this.academicInfo = event;
    }, 100);
    var f = $("form.frmAcademic").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrAcademicInfoService.insertHrAcademicInfo(this.academicInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.onReset()
      }
    })
  }
  onReset() {
    this.reloadDatatable();
    $("form.frmAcademic")
      .validate()
      .resetForm();
    this.hrAcademicInfoService.resetModel();
    this.academicInfo = this.hrAcademicInfoService.getModel();
    //
    this.academicInfo.company_id = this.companyId;
    this.academicInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".eplAcademicInfoList")
      .DataTable()
      .ajax.reload();
  }
}
