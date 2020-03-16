import { Component, OnInit } from '@angular/core';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { PositionModel } from '@app/core/models/position.model';
import { PositionMasterService } from '@app/core/services/features.services/position-master.service';

import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
@Component({
  selector: 'sa-position-master',
  templateUrl: './position-master.component.html',
  styleUrls: ['./position-master.component.css']
})
export class PositionMasterComponent extends BasePage implements OnInit, CanDeactivateGuard {
  cate_cd: number;
  companies: PositionModel[] = [];
  detailInfo: PositionModel;
  options: any;

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private positionMasterService: PositionMasterService,
    public programService: ProgramService,
    private i18nService: I18nService,

    public userService: AuthService
  ) {
    super(userService);
    this.cate_cd = Category.PositionCateCode;
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      text_value_1: {
        required: true
      },
      general_nm: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      text_value_1: {
        required: "Please select the company"
      },
      general_nm: {
        required: "Please enter the position name"
      },
    }
  };


  ngOnInit() {
    this.checkPermission(ProgramList.Register_Position.valueOf())
    this.initModel();
    this.detailInfo.company_id = this.loggedUser.company_id;
    this.getCompanies().then(data => {
      this.companies.push(...data);
    });
    
    this.initDatatable();
  }
  initModel() {
    this.detailInfo = new PositionModel();
  }
  getTime() {
    var d = new Date();
    return d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
  }
  // private getCompanies() {
  //   return new Promise<any>((resolve, reject) => {
  //     this.api.get(`/position/details/catecd/${Category.PositionCateCode.valueOf()}`).subscribe(data => {
  //       resolve(data.data);
  //     });
  //   });
  // }
  private getCompanies() {
    let _isSytem = this.userService.isSystemCompany()? 'list' : 'details';
    return new Promise<any>((resolve, reject) => {
      this.api.get(`company/${_isSytem}`).subscribe(data => {         
        resolve(data.data);
      });
    });
  }
  onChangeCompany(e){
    this.initModel();
    this.detailInfo.company_id=e;
    this.reloadDatatable();
  }

  private initDatatable() {
    //console.log('initDataTable');
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get(`/position/list?companyId=${this.detailInfo.company_id}`).subscribe(data => {
          callback({
            aaData: data.data
          });
        });
      },
      columns: [
        { data: "company_nm", width: "120px" },
        { data: "gen_nm", width: "150px" },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center", width: "50px"
        },
        { data: "remark", className: "", width: "auto" },
        { data: "creator", className: "center", width: "90px" },
        {
          data: "created_time",
          className: "center", width: "120px"
        },
        { data: "changer", className: "center", width: "90px" },
        {
          data: "changed_time",
          className: "center"
          , width: "120px"
        }
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            this.onReset();
          }
        },
        {
          extend: 'selected',
          text: '<i class="fa fa-trash-o" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data()
            if (rowSelected) {
              var selectedText: string = rowSelected.gen_nm;
              this.notification.confirmDialog(
                "Delete Position Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api.post("/position/delete", rowSelected).subscribe(data => {
                      if (!data.success) {
                        this.notification.showMessage("error", data.data.message);
                      }
                      else {
                        this.notification.showMessage("success", "Deleted successfully");
                        this.onReset();
                      }
                    });
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
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    setTimeout(() => {
      this.detailInfo = event;
    }, 100);
  }

  onSubmit() {
    this.detailInfo.cate_cd = this.cate_cd.toString();
    if (this.detailInfo.gen_cd == undefined) {
      this.detailInfo.gen_cd = '0';
    }

    if (this.detailInfo.gen_cd === '0') {
      this.api.post("position/insert", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
          this.onRowClick(Object.assign({}, new PositionModel(), { company_id: this.detailInfo.company_id}));
        }
      });
    } else {
      this.api.post("position/update", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  onReset() {
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    let curCompanyId=this.detailInfo.company_id;
    this.initModel();
    this.detailInfo.company_id=curCompanyId;
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
