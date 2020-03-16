import { Component, OnInit } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HrMedicalInfoService } from '@app/core/services/hr.services/hr-medical-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrMedicalInfoModel } from '@app/core/models/hr/hr-medical-info.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';
import { ProgramList } from '@app/core/common/static.enum';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-medical-info',
  templateUrl: './medical-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRMedicalInfoComponent extends BasePage implements OnInit {

  medicalInfo: HrMedicalInfoModel;
  options: any;
  companyId: number = 0;
  hrId: string = '';
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrMedicalInfoService: HrMedicalInfoService,
    public userService: AuthService,
    private i18nService:I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }
  
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.medicalInfo = this.hrMedicalInfoService.getModel();
    this.initDatatable();

    $('.medical-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.medicalInfo.medical_ymd = selectedDate;
      }
    });
  }

  getDataFromMain(companyID: number, hrID: string) {
    if (this.companyId === 0) {
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
    this.hrMedicalInfoService.resetModel();
    this.medicalInfo = this.hrMedicalInfoService.getModel();
    $(".eplMedicalInfoList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      medical_ymd: {
        required: true
      },
      medical_nm: {
        required: true
      },
      medical_result: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      medical_ymd: {
        required: "Please enter"
      },
      medical_nm: {
        required: "Please enter "
      },
      medical_result: {
        required: "Please enter "
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrMedicalInfoService.listMedical(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        { data: "medical_ymd", className: "center", width: "100px" },
        { data: "medical_nm", className: "", width: "150px" },
        { data: "medical_result", className: "center", width: "150px" },
        { data: "remark", className: "", width: "200px" }
      ],
      //scrollY: 210,
      //scrollX: true,
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
              var selectedText: string = rowSelected.medical_nm;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrMedicalInfoService.DeleteHrMedicalInfo(this.medicalInfo).then(data => {
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
      this.medicalInfo = event;
    }, 100);
    var f = $("form.medical-form").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrMedicalInfoService.insertHrMedicalInfo(this.medicalInfo).then(data => {
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
    this.reloadDatatable();
    $("form.medical-form")
      .validate()
      .resetForm();
    this.hrMedicalInfoService.resetModel();
    this.medicalInfo = this.hrMedicalInfoService.getModel();
    //
    this.medicalInfo.company_id = this.companyId;
    this.medicalInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".eplMedicalInfoList")
      .DataTable()
      .ajax.reload();
  }
}
