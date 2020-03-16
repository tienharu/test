import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { AuthService } from "@app/core/services/auth.service";
import { LoggedUserInfoModel } from "@app/core/models/logged-user-info.model";
import { UserMasterService } from "@app/core/services/features.services/user-master.service";
import { UserModel } from "@app/core/models/user.model";
import { CompanyModel } from "@app/core/models/company.model";
import { PositionModel } from "@app/core/models/position.model";
import { OrganizationModel } from "@app/core/models/organization.model";
import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { Category, ProgramList } from "@app/core/common/static.enum";
import { NameValueModel } from "@app/core/models/name-value.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { OrganizationMasterService, ProgramService } from "@app/core/services";
import { BasePage } from "@app/core/common/base-page";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { CommonFunction } from "@app/core/common/common-function";

@Component({
  selector: "sa-user-master",
  templateUrl: "./user-master.component.html",
  styleUrls: ["./user-master.component.css"]
})
export class UserMasterComponent extends BasePage implements OnInit, CanDeactivateGuard {
  @ViewChild("tplResetPass")
  tplResetPass;
  modalRef: BsModalRef;

  updating: boolean = false;
  options: any;
  detailInfo: UserModel;
  loggedUser: any = {};
  showTempPassword: boolean = false;
  idReadOnly: boolean = false;
  companyIdBackup : number = 0;

  companies: CompanyModel[] = [];
  positions: GeneralMasterModel[] = [];
  organizations: OrganizationModel[] = [];

  systemTypes: NameValueModel[] = [
    {
      name: "CIS",
      value: "1"
    },
    {
      name: "WF",
      value: "2"
    }
  ];
  entryDate:any='';
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private userMasterService: UserMasterService,
    private orgService: OrganizationMasterService,
    public userService: AuthService,
    public programService: ProgramService,
    private i18nService: I18nService,

    private modalService: BsModalService
  ) {
    super(userService);
    
  }


  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      company_id: {
        required: true
      },
      org_id: {
        required: true
      },
      position_gen_cd: {
        required: true
      },
      user_nm: {
        required: true,
        minlength: 3,
        maxlength:20,
        alphanumeric: true
      },
      password: {
        required: function(x) {
          return $("input[name='user_id']").val() == "0";
        }
      },
      email: {
        email: true
      }
    },
    // Messages for form validation
    messages: {
      company_id: {
        required: "Please select company"
      },
      org_id: {
        required: "Please select organization"
      },
      position_gen_cd: {
        required: "Please select position"
      },
      user_nm: {
        required: "Please type login ID",
        minlength: "At least 3 letter",
        maxlength:'Max 20 letters',
        alphanumeric: "Allowed alphabet+numeric only"
      },
      password: {
        required: "Password isn\'t empty"
      },
      email: {
        email: "Email is not valid"
      }
    }
  };

  ngOnInit() {
    this.checkPermission(ProgramList.Register_User.valueOf())
    this.loggedUser = this.userService.getUserInfo();
    this.initModel();
    this.showTempPassword = true;
    this.getCompanies().then(data => {
      this.companies.push(...data);
    });

    this.getPositions(this.loggedUser.company_id).then(data => {
      this.positions=data;
    });

    this.getOrganizations(this.loggedUser.company_id).then(data => {
      this.organizations=data;
    });

    this.initDatatable();
  }
  initModel() {
    
    this.detailInfo = this.userMasterService.getModel();
    if(this.companyIdBackup>0){
      this.detailInfo.company_id = this.companyIdBackup;
    }
    else{
      this.detailInfo.company_id = this.loggedUser.company_id;
    }
    this.detailInfo.creator=this.loggedUser.user_name;
    this.entryDate=new Date().toString('yyyy-MM-dd');
  }
  // private getCompanies() {
  //   return new Promise<CompanyModel[]>((resolve, reject) => {
  //     this.api.get("/company/list").subscribe(data => {
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
      this.getOrganizations(this.detailInfo.company_id).then(data => {
        this.organizations=data
        // if(data.length>0){
        //   this.detailInfo.org_id=data[0].org_cd;
        // }
      });
      this.getPositions(this.detailInfo.company_id).then(data => {
        this.positions=data;
        // if(data.length>0){
        //   this.detailInfo.position_gen_cd=data[0].gen_cd;
        // }
      });
      this.reloadDatatable();this.companyIdBackup = companyId;
    }
  }

  private getPositions(companyId) {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      //position/list?companyId=
      this.api
        .get(`/position/list?companyId=${companyId}`)
        .subscribe(data => {
          resolve(data.data);
        });
    });
  }

  private getOrganizations(companyId) {
    return this.orgService.listOrganization(companyId)
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get(`/user/list?companyId=${this.detailInfo.company_id}`).subscribe(data => {
          console.log(data);
          Promise.all([
            this.getCompanies,
            this.getPositions,
            this.getOrganizations
          ]).then(res => {
            callback({
              aaData: data.data
            });
          });
        });
      },
      columns: [
        { data: "user_id", className: "center", width: "60px" },
        { data: "user_nm" },
        { data: "full_name" },
        { data: "email" },
        {
          data: (data, type, dataToSet) => {
            var c = this.companies.filter(
              x => x.company_id === data.company_id
            );
            if (c.length > 0) return c[0].company_eng_nm;
            else return "N/A";
          }
        },
        {
          data: (data, type, dataToSet) => {
            var p = this.positions.filter(
              x => x.gen_cd === data.position_gen_cd
            );
            if (p.length > 0) return p[0].gen_nm;
            else return "N/A";
          }
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.organizations.filter(
              x => x.org_cd === data.org_id
            );
            if (o.length > 0) return o[0].org_nm_eng;
            else return "N/A";
          }
        },
        //{ data: "use_sys", className: "center" },
        // { data: "setting_ymd", className: "center" },
        {
          data: (data, type, dataToSet) => {
            return data.super_yn ? "Yes" : "No";
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center"
        },
        // { data: "remark" },
        { data: "creator", className: "center" },
        {
          data: "created_time",
          className: "center"
        },
        { data: "changer", className: "center" },
        {
          data: "changed_time",
          className: "center"
        }
      ],
      // scrollY: 553,
      scrollX: true,
      // paging: false,

      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            //this.detailInfo = new UserModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-trash-o" title="Delete"></i>',
          action: (e, dt, button, config) => {
            // if(!this.permission.canDelete){
            //   this.notification.showMessage("error",  this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
            //   return;
            // }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.full_name;
              this.notification.confirmDialog(
                "Delete system user confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .post("/user/delete", rowSelected)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
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
        "excel",
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
    this.updating = true;
    setTimeout(() => {
      this.detailInfo = event;
      // if(!event.use_sys){
      //   this.detailInfo.use_sys="1";
      // }

      this.entryDate = CommonFunction.getDateFromDatetime(this.detailInfo.created_time)

      this.showTempPassword = false;
      this.idReadOnly = true;
      this.disableInput(true);
    }, 100);
  }

  onSubmit() {
    //console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    if (this.detailInfo.user_id === 0) {
      this.api.get(`/user/check/${this.detailInfo.user_nm}`).subscribe(data => {
        // user id is existed.
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        }
        // user id is not existed. allow insert.
        else {
          this.api.post("user/insert", this.detailInfo).subscribe(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.data.message);
            } else {
              this.notification.showMessage("success", data.data.message);
              this.reloadDatatable();
            }
          });
        }
      });
    } else {
      this.api.post("user/update", this.detailInfo).subscribe(data => {
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
    this.userMasterService.resetModel();
    this.initModel();

    this.showTempPassword = true;
    this.idReadOnly = false;
    this.updating = false;
    this.disableInput(false);
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.userMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  generateTempPass() {
    if (this.detailInfo.user_nm == "") {
      this.detailInfo.password = "";
    } else {
      this.detailInfo.user_nm=this.detailInfo.user_nm.toLocaleLowerCase()
      this.detailInfo.password = this.detailInfo.user_nm + "1234";
    }
  }
  disableInput(status: boolean) {
    if (status) {
      $('input[name="user_nm"]').attr("readonly", true);
      $('input[name="password"]')
        .val("******")
        .attr("readonly", true);
    } else {
      $('input[name="user_nm"]').removeAttr("readonly");
      $('input[name="password"]')
        .val("")
        .removeAttr("readonly");
    }
  }

  openResetPassPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.tplResetPass, config);
  }
  closePopupModal() {
    this.modalRef && this.modalRef.hide();
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
