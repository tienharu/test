import { Component, OnInit } from '@angular/core';
import { HrLastCareerService } from '@app/core/services/hr.services/hr-last-career.service';
import { NotificationService } from '@app/core/services/notification.service';
import { HrLastCareerModel } from '@app/core/models/hr/hr-last-career.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService } from '@app/core/services';
import { ProgramList } from '@app/core/common/static.enum';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-last-care',
  templateUrl: './last-care.component.html',
  styleUrls: ['../../../main-info/main-info2.component.css']
})
export class LastCareComponent extends BasePage implements OnInit {
  lastCareInfo: HrLastCareerModel;
  options : any;
  companyId: number = 0;
  hrId: string = '';
  validLastCareOptions:any={};
  hrIdBK : string = '';
  constructor(
    private notification: NotificationService,
    private hrLastCareerService: HrLastCareerService,
    public userService: AuthService,
    private i18nService:I18nService,
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
    this.lastCareInfo = this.hrLastCareerService.getModel();
    this.initDatatable();
    $('.joined-lastcare-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.lastCareInfo.last_joined_ymd = selectedDate;
      }
    });
    $('.retired-lastcare-datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (selectedDate) => {
        this.lastCareInfo.last_retired_ymd = selectedDate;
      }
    });
  }

  getDataFromCareer(companyID: number, hrID: string) {
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
  resetChildCare(){
    this.hrLastCareerService.resetModel();
    this.lastCareInfo = this.hrLastCareerService.getModel();
    $(".eplLastCareList").DataTable().clear().draw();
  }
  //validate
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      last_company_nm: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      last_company_nm: {
        required: "Please enter"
      }
    }
  };
  //
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.hrLastCareerService.listlastCare(this.companyId, this.hrId).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [
        { data: "last_company_nm", className: "", width: "100px" },
        { data: "last_work_nm", className: "", width: "100px" },
        { data: "last_position", className: "", width: "100px" },
        { data: "last_joined_ymd", className: "center", width: "100px" },
        { data: "last_retired_ymd", className: "center", width: "100px" }
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
              var selectedText: string = rowSelected.last_company_nm;
              this.notification.confirmDialog(
                "Delete Employee Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.hrLastCareerService.DeleteHrLastCare(this.lastCareInfo).then(data => {
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
      this.lastCareInfo = event;
    }, 100);
    var f = $("form.frmLastCare").validate();
    if (!f.valid()) {
      f.resetForm();
    }

  }
  //
  onSubmit() {
    console.log(this.lastCareInfo);
    this.hrLastCareerService.insertHrLastCare(this.lastCareInfo).then(data => {
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
    $("form.frmLastCare")
      .validate()
      .resetForm();
    this.hrLastCareerService.resetModel();
    this.lastCareInfo = this.hrLastCareerService.getModel();
    //
    this.lastCareInfo.company_id = this.companyId;
    this.lastCareInfo.hr_id = this.hrId;
  }

  private reloadDatatable() {
    $(".eplLastCareList")
      .DataTable()
      .ajax.reload();
  }
}
