import { Component, OnInit } from "@angular/core";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { Category, ProgramList } from "@app/core/common/static.enum";
import { PackageModel } from "@app/core/models/package.model";
import { PackageMasterService } from "@app/core/services/features.services/package-master.service";

import { BasePage } from "@app/core/common/base-page";
import { AuthService, ProgramService } from "@app/core/services";
import { I18nService } from "@app/shared/i18n/i18n.service";

@Component({
  selector: "sa-package-master",
  templateUrl: "./package-master.component.html",
  styleUrls: ["./package-master.component.css"]
})
export class PackageMasterComponent extends BasePage
  implements OnInit, CanDeactivateGuard {
  cate_cd: number;
  companies: PackageModel[] = [];
  detailInfo: PackageModel;
  options: any;

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private packageMasterService: PackageMasterService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService
  ) {
    super(userService);
    this.cate_cd = Category.PackingCateCode;
  }
  
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      pack_nm: {
        required: true
      },
      money_amount: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      pack_nm: {
        required: "Please enter the package name"
      },
      money_amount: {
        required: "Please enter money"
      }
    }
  };

  ngOnInit() {
    this.checkPermission(ProgramList.Package_Managerment.valueOf())
    this.initModel();
    this.initDatatable();
  }
  initModel() {
    this.detailInfo = this.packageMasterService.getModel();
  }

  private initDatatable() {
    //console.log('initDataTable');
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.api.get("/package/list").subscribe(data => {
          callback({
            aaData: data.data
          });
        console.log("data",data.data)
        });
      },
      columns: [
        { data: "pack_id", width: "50px", className: "center", },
        { data: "pack_nm", width: "200px" },
        {
          data: "money_amount",
          width: "120px",
          className: "right",
          render: $.fn.dataTable.render.number(",", ".", 0)
        },
        {
          data: "user_amount",
          width: "120px",
          className: "right",
          render: $.fn.dataTable.render.number(",", ".", 0)
        },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center",
          width: "50px"
        },
        { data: "remark", className: "", width: "auto" },
        { data: "creator", className: "center", width: "90px" },
        {
          data: "created_time",
          className: "center",
          width: "120px"
        },
        { data: "changer", className: "center", width: "90px" },
        {
          data: "changed_time",
          className: "center",
          width: "120px"
        }
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new PackageModel();
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
              var selectedText: string = rowSelected.pack_nm;
              this.notification.confirmDialog(
                "Delete Package Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .post("/package/delete", rowSelected)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
                          this.detailInfo = new PackageModel();
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
    console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    if (this.detailInfo.pack_id === 0) {
      this.api.post("package/insert", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
          this.onRowClick(this);
        }
      });
    } else {
      this.api.post("package/update", this.detailInfo).subscribe(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    }
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
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.packageMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
