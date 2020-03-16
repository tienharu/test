import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { NgForm } from '@angular/forms';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GlobalAcService } from '@app/core/services/global-ac.service';
import { GlobalAcModel, DrCrType, FsType } from '@app/core/models/global-ac.model';
import { ProgramList } from '@app/core/common/static.enum';
import { CompanyCfModel } from '@app/core/models/company-cf.model';
import { start } from 'repl';
import { min } from 'rxjs/operators';

@Component({
  selector: 'sa-global-ac',
  templateUrl: './global-ac.component.html',
  styleUrls: ['./global-ac.component.css']
})
export class GlobalAcComponent extends BasePage implements OnInit {
  options: any;
  detailInfo: GlobalAcModel;
  isSubmit: boolean = false;
  isDisabled: boolean = false;
  companyIdBackup: number = 0;
  FSTypes: FsType[] = [
    {
      name: "FP",
      value: '1'
    },
    {
      name: "IS",
      value: '2'
    },
    {
      name: "COGS",
      value: '3'
    },
    {
      name: "SCF",
      value: '4'
    }
  ];

  DrCrType: DrCrType[] = [
    {
      name: "Dr",
      value: '1'
    },
    {
      name: "Cr",
      value: '2'
    }
  ]
  constructor(public userService: AuthService,
    public programService: ProgramService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public globalAcService: GlobalAcService,
    private i18nService: I18nService) {
    super(userService);
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      standardacctcd: {
        required: true
      },
      drcr: {
        required: true
      },
      sortorder: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      standardacctcd: {
        required: "The length is 8 digits"
      },
      drcr: {
        required: "!"
      }
    }
  };

  ngOnInit() {
    this.checkPermission(ProgramList.Account_Master.valueOf())
    this.initModel();
    this.detailInfo.companyid = this.companyInfo.company_id;
    this.initDatatable();
    $("#spinner-global").spinner();
    $("#form-spinner a").css("font-size", "8px");
    $("#form-spinner a").css("width", "15px");

  }

  initModel() {

    if (this.companyIdBackup === 0) {
      this.detailInfo = this.globalAcService.getModel();
      this.detailInfo.is_system = this.userService.isSystemCompany();
      this.companyIdBackup = this.detailInfo.companyid = this.loggedUser.company_id;
    }
    else {
      this.detailInfo = this.globalAcService.getModel();
      this.detailInfo.companyid = this.companyIdBackup;
    }

  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.globalAcService.listGlobalAc().then(data => {
          callback({
            aaData: data
          });

        })
      },
      columns: [
        {
          render: function (data, type, full, meta) {
            var index = meta.row;
            return ++index;
          }, className: "center", width: "50px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.FSTypes.filter(x => x.value === data.fstype);
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "center", width: "100px"
        },
        { data: "sortorder", width: "150px", className: "center", },
        { data: "standardacctcd", width: "150px", className: "center" },
        { data: "acctkoreanm", width: "300px" },
        { data: "acctsimkoreanm", width: "350px" },
        { data: "acctengnm", width: "300px" },
        { data: "acctsimengnm", width: "350px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.DrCrType.filter(x => x.value === data.drcr);
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "center", width: "70px"
        },
        {
          data: (data, type, dataToSet) => {
            return data.useyn ? "Yes" : "No";
          },
          className: "center",
          width: "50px"
        },
        { data: "remark", width: "auto" },
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new GlobalAcModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if (!this.permission.canDelete) {
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = "Account Global";
              this.notification.confirmDialog(
                "Delete Account Global Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .delete("mas-account-global/" + rowSelected.standardacctcd)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
                          this.detailInfo = new GlobalAcModel();
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

  onSubmit() {
    console.log("detailInfo",this.detailInfo.createdtime);
    this.detailInfo.sortorder = $("#spinner-global").spinner("value");
    if (this.detailInfo.createdtime == "") {
     
      this.globalAcService.insertGlobalAc(this.detailInfo).then(data => {
        console.log("detailInfo",data);
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    } else {
      
      this.globalAcService.updateGlobalAc(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    }
  }


  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    setTimeout(() => {
      this.detailInfo = event;
      this.isDisabled = true;
    }, 100);
  }


  onReset(f: NgForm) {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.globalAcService.resetModel();
    this.companyIdBackup = 0;
    this.initModel();
    this.reloadDatatable();
  }


  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
    this.isDisabled = false;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

}
