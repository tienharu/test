import { Component, OnInit } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HrAppraisalInfoService } from '@app/core/services/hr.services/hr-appraisal-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrAppraisalInfoModel } from '@app/core/models/hr/hr-appraisal-info.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BasePage } from '@app/core/common/base-page';
import { AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-appraisal-info',
  templateUrl: './appraisal-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRAppraisalInfoComponent extends BasePage implements OnInit {

  appraisal: HrAppraisalInfoModel;
  options: any;
  companyId: number = 0;
  hrId: string = '';
  period: any[] = [];
  contribution: any[] = [];
  result: any[] = [];
  capability: any[] = [];
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrAppraisalInfoService: HrAppraisalInfoService,
    private generalMasterService: GeneralMasterService,
    public userService: AuthService,
    private i18nService:I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }
  
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.appraisal = this.hrAppraisalInfoService.getModel();
    this.initDatatable();
    $('.appraisal-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.appraisal.eval_ymd = selectedDate;
      }
    });
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
  //
  getDataFromMain(companyID: number, hrID: string) {
    if (this.companyId === 0) {
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
      this.companyId = companyID;
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
    else{this.hrId = hrID;}

    if (this.hrIdBK !== hrID) {
      this.hrId = this.hrIdBK = hrID;
      this.onReset();
    }
  }
  resetData(){
    this.hrAppraisalInfoService.resetModel();
    this.appraisal = this.hrAppraisalInfoService.getModel();
    $(".eplAppraisalInfoList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      eval_ymd: {
        required: true
      },
      eval_period_gen_cd: {
        required: true
      },
      eval_type_gen_cd: {
        required: true
      },
      eval_result_gen_cd: {
        required: true
      },
      capability_level_gen_cd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      eval_ymd: {
        required: "Please enter"
      },
      eval_period_gen_cd: {
        required: "Please enter "
      },
      eval_type_gen_cd: {
        required: "Please enter "
      },
      eval_result_gen_cd: {
        required: "Please enter "
      },
      capability_level_gen_cd: {
        required: "Please enter "
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrAppraisalInfoService.listAppraisal(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var o = this.period.filter(x => x.gen_cd === data.eval_period_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { data: "eval_ymd", className: "center", width: "100px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.capability.filter(x => x.gen_cd === data.capability_level_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        }, {
          data: (data, type, dataToSet) => {
            var o = this.contribution.filter(x => x.gen_cd === data.eval_type_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        }, {
          data: (data, type, dataToSet) => {
            var o = this.result.filter(x => x.gen_cd === data.eval_result_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        }, 
        {data: "remark", className: "", width: "100px"}
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
              var selectedText: string = rowSelected.eval_period_gen_cd;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrAppraisalInfoService.DeleteHrAppraisalInfo(this.appraisal).then(data => {
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
      this.appraisal = event;
    }, 100);
    var f = $("form.frmAppraisal").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrAppraisalInfoService.insertHrAppraisalInfo(this.appraisal).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.onReset();
      }
    })
  }
  onReset() {
    $("form.frmAppraisal")
      .validate()
      .resetForm();
    this.hrAppraisalInfoService.resetModel();
    this.appraisal = this.hrAppraisalInfoService.getModel();
    //
    this.appraisal.company_id = this.companyId;
    this.appraisal.hr_id = this.hrId;

    this.reloadDatatable();
  }

  private reloadDatatable() {
    $(".eplAppraisalInfoList")
      .DataTable()
      .ajax.reload();
  }
}
