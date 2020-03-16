import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { HrFamilyInfoService } from '@app/core/services/hr.services/hr-family-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { HrFamilyInfoModel } from '@app/core/models/hr/hr-family-info.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BasePage } from '@app/core/common/base-page';
import { AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-family-info',
  templateUrl: './family-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRFamilyInfoComponent extends BasePage implements OnInit {

  familyInfo: HrFamilyInfoModel;
  relation: any[] = [];
  options: any;
  companyId: number = 0;
  hrId: string = '';
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    public userService: AuthService,
    private hrFamilyInfoService: HrFamilyInfoService,
    private generalMasterService: GeneralMasterService,
    private i18nService:I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
  }
 
  ngOnInit() {
    this.checkPermission(ProgramList.Personal_Info_Master.valueOf());
    this.familyInfo = this.hrFamilyInfoService.getModel();
    this.initDatatable();
    // $('.family-ymd-datepicker').datepicker({
    //   dateFormat: 'yy-mm-dd',
    //   onSelect: (selectedDate) => {
    //     this.familyInfo.birth_ymd = selectedDate;
    //   }
    // });
  }
  //
  getRelation() {
    return this.generalMasterService.listGeneralByCate(Category.FamilyRelationship.valueOf())
  }
  getDataFromMain(companyID: number, hrID: string) {
    if (this.companyId === 0) {
      this.getRelation().then(data => {
        this.relation.push(...data)
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
    this.hrFamilyInfoService.resetModel();
    this.familyInfo = this.hrFamilyInfoService.getModel();
    $(".eplFamilyInfoList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      relate_gen: {
        required: true
      },
      family: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      relate_gen: {
        required: "Please enter"
      },
      family: {
        required: "Please enter "
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrFamilyInfoService.listFamily(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });

        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var o = this.relation.filter(x => x.gen_cd === data.relate_gen);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { data: "family", className: "", width: "100px" },
        { data: "birth_ymd", className: "center", width: "100px" },
        { data: "national_id", className: "center", width: "100px" },
        { data: "social_insurance_num", className: "center", width: "100px" },
        { data: "medical_insurance_num", className: "center", width: "100px" },
        { data: "duty_place", className: "", width: "150px" },
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
              var selectedText: string = rowSelected.family;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrFamilyInfoService.DeleteHrFamilyInfo(this.familyInfo).then(data => {
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
      this.familyInfo = event;
    }, 100);
    var f = $("form.frmFamily").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    this.hrFamilyInfoService.insertHrFamilyInfo(this.familyInfo).then(data => {
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
    $("form.frmFamily")
      .validate()
      .resetForm();
    this.hrFamilyInfoService.resetModel();
    this.familyInfo = this.hrFamilyInfoService.getModel();
    //
    this.familyInfo.company_id = this.companyId;
    this.familyInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".eplFamilyInfoList")
      .DataTable()
      .ajax.reload();
  }
}
