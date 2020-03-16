import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { AuthorityGroupModel } from "@app/core/models/authority-group.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { AuthService } from "@app/core/services/auth.service";
import { RegisterAuthorityGroupService } from "@app/core/services/features.services/register-authority-group.service";
import { LoggedUserInfoModel } from "@app/core/models/logged-user-info.model";
import { csLocale } from "ngx-bootstrap";
import { BasePage } from "@app/core/common/base-page";
import { ProgramService } from "@app/core/services";
import { ProgramList } from "@app/core/common/static.enum";
import { I18nService } from "@app/shared/i18n/i18n.service";

@Component({
  selector: "sa-register-authority-group",
  templateUrl: "./register-authority-group.component.html",
  styleUrls: ["./register-authority-group.component.css"]
})
export class RegisterAuthorityGroupComponent extends BasePage
  implements OnInit, CanDeactivateGuard {
  options: any;
  detailInfo: AuthorityGroupModel;
  loggedUserInfo: LoggedUserInfoModel;
  companies: any = [];
  companyIdBackup:number = 0;
  isRowClick : boolean = false;

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    private i18nService: I18nService,

    private registerAuthorityGroupService: RegisterAuthorityGroupService,
    public userService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    super(userService);
  }
  

  // private getCompanies() {
  //   return new Promise<any>((resolve, reject) => {
  //     this.api.get(`/company/list/`).subscribe(data => {
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
  onChangeCompany(companyId:number){
    if (this.companyIdBackup !== companyId) {
      this.reloadDatatable();
    this.detailInfo = new AuthorityGroupModel();
      this.companyIdBackup = companyId;
      this.detailInfo.company_id = companyId;
    }
  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      company_id: {
        required: true
      },
      author_group_nm: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      company_id: {
        required: "Please select company"
      },
      author_group_nm: {
        required: "Please enter authority group name"
      }
    }
  };
  initModel() {
    this.detailInfo = this.registerAuthorityGroupService.getModel();
      this.companyIdBackup = this.detailInfo.company_id=this.loggedUser.company_id;
      this.detailInfo.creator = this.loggedUser.user_name;
      this.detailInfo.is_system=this.userService.isSystemCompany();

      this.detailInfo.created_time=new Date().toString('yyyy-MM-dd HH:mm')
  }
  ngOnInit() {
    this.checkPermission(ProgramList.Register_Authority_Group.valueOf())
    this.initModel();
    this.getCompanies().then(data => {
      this.companies.push(...data);
    });
    this.initDatatable();
  }

  private initDatatable() {
    
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get(`/authorgroup/list?companyId=${this.detailInfo.company_id}`).subscribe(data => {
          callback({
            aaData: data.data
          });
        });
      },
      columns: [
        { data: "author_group_id", className: "center" },
        { data: "author_group_nm" },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center"
        },
        { data: "remark" }
      ],
      // scrollY: 553,
      //scrollX: true,
      // paging: false,
      columnDefs: [
        { width: "60px", targets: 0 },
        { width: "300px", targets: 1 },
        { width: "50px", targets: 2 },
        { width: "auto", targets: 3 }
      ],
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new AuthorityGroupModel();
            this.detailInfo.company_id = this.companyIdBackup;
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.author_group_nm;
              this.notification.confirmDialog(
                "Delete Authority Group Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .post("/authorgroup/delete", rowSelected)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
                          this.initModel();
                        }
                      });
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

  onRowClick(event) {
    this.isRowClick = true;
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }

    this.detailInfo = event;
    this.cdr.detectChanges();
  }

  onSubmit() {
    //console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    // this.detailInfo.company_id = this.loggedUser.company_id;
    if (this.detailInfo.author_group_id === 0) {
      this.api.post("authorgroup/insert", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.api.post("authorgroup/update", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    }
    this.isRowClick = false;
    this.companyIdBackup = this.detailInfo.company_id;
  }

  onReset(f: NgForm) {
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.initModel();
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
      this.isRowClick = false;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.registerAuthorityGroupService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
