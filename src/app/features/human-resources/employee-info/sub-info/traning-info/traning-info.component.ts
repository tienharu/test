import { Component, OnInit } from '@angular/core';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HrTraningInfoService } from '@app/core/services/hr.services/hr-traning-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';

import { OrganizationMasterService } from '@app/core/services/features.services/organization-master.service';
import { HrTraningInfoModel } from '@app/core/models/hr/hr-traning-info.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BasePage } from '@app/core/common/base-page';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'sa-traning-info',
  templateUrl: './traning-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRTraningInfoComponent extends BasePage implements OnInit {

  traningInfo: HrTraningInfoModel;
  organizer: any[] = [];
  trainingType: any[] =[];
  trainingDS: any;
  options: any;
  companyId: number = 0;
  hrId: string = '';
  hrIdBK : string = '';
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private hrTraningInfoService: HrTraningInfoService,
    private OrgMasterService: OrganizationMasterService,
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
    this.traningInfo = this.hrTraningInfoService.getModel();
    this.initDatatable();
    $('.training-ymd-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.traningInfo.from_ymd = selectedDate;
      }
    });
  }
  getOrganizer(_companyID: number) {
    return this.generalMasterService.listGeneralByCate(Category.OrganizerType.valueOf());
  }
  getTrainingType(_companyID: number) {
    return this.generalMasterService.listGeneralByCate(Category.TrainingType.valueOf());
  }


  getDataFromMain(companyID: number, hrID: string) {
    if (this.companyId === 0) {
      this.getOrganizer(companyID).then(data => {
        this.organizer.push(...data);
      });
      this.getTrainingType(companyID).then(data => {
        this.trainingType.push(...data);
      });
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
    this.hrTraningInfoService.resetModel();
    this.traningInfo = this.hrTraningInfoService.getModel();
    $(".epltraningInfoList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      from_ymd: {
        required: true
      },
      training_type_gen_cd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      from_ymd: {
        required: "Please enter"
      },
      training_type_gen_cd: {
        required: "Please enter "
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrTraningInfoService.listTraining(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });

        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var o = this.trainingType.filter(x => x.gen_cd == data.training_type_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { data: "from_ymd", className: "center", width: "100px" },
        { data: "training_sum_hour", className: "center", width: "100px" },
        {
          data: (data, type, dataToSet) => {         
            var o = this.organizer.filter(x => x.gen_cd == data.organizer_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { data: "last_score", className: "center", width: "100px" },
        { data: "after_score", className: "center", width: "100px" },
        { data: "final_score", className: "center", width: "150px" },
        { data: "cetificate_yn", className: "center", width: "30px" },
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
              var selectedText: string = rowSelected.training_type_gen_cd;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrTraningInfoService.DeleteHrTrainingInfo(this.traningInfo).then(data => {
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
      this.traningInfo = event;
    }, 100);
    var f = $("form.frmTraining").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrTraningInfoService.insertHrTrainingInfo(this.traningInfo).then(data => {
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
    $("form.frmTraining")
      .validate()
      .resetForm();
    this.hrTraningInfoService.resetModel();
    this.traningInfo = this.hrTraningInfoService.getModel();
    //
    this.traningInfo.company_id = this.companyId;
    this.traningInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".epltraningInfoList")
      .DataTable()
      .ajax.reload();
  }
}
