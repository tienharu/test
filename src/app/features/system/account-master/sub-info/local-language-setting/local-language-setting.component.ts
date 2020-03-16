import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { NgForm } from '@angular/forms';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { LocalLanguageService } from '@app/core/services/local-language.service';
import { LocalLanguageModel, FsTypeModels } from '@app/core/models/local-language.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';

@Component({
  selector: 'sa-local-language-setting',
  templateUrl: './local-language-setting.component.html',
  styleUrls: ['./local-language-setting.component.css']
})
export class LocalLanguageSettingComponent extends BasePage implements OnInit {
  options: any
  localLanguage: GeneralMasterModel[] = [];
  languageSetting: any;
  detailInfo: LocalLanguageModel
  FSTypes: FsTypeModels[] = [
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
  companies: any[] = [];
  constructor(
    public userService: AuthService,
    public programService: ProgramService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private localLanguageService: LocalLanguageService,
    private generalMasterService: GeneralMasterService,
    private i18nService: I18nService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Account_Master.valueOf())
    this.detailInfo = new LocalLanguageModel();
    this.detailInfo.companyid = this.companyInfo.company_id;
    this.detailInfo.fstype = "1";
    this.companies.push(this.companyInfo);
    this.initDatatable();
    this.getLocalLanguage().then(data => {
      this.localLanguage.push(...data);
    });
  }

  private getLocalLanguage() {
    return this.generalMasterService.listGeneralByCate(Category.LocalCountryCateCode.valueOf());
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.localLanguageService.listLocalLanguage(this.detailInfo.companyid, this.detailInfo.locallanguagegid ? this.detailInfo.locallanguagegid : null, this.detailInfo.fstype).then(data => {
          var languageType = this.detailInfo.locallanguagegid;
          callback({
            aaData: data.filter(x=>x.locallanguagegid ==languageType)
          });
        });
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
            var o = this.localLanguage.filter(x => x.gen_cd === data.locallanguagegid);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.companies.filter(x => x.company_id === data.companyid);
            if (o.length > 0) return o[0].company_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        { data: "companyacctcd", width: "100px",className:"center" },
        { data: "acctkoreanm", width: "150px" },
        { data: "acctengnm", width: "150px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.FSTypes.filter(x => x.value === data.fstype);
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "left", width: "50px"
        },
        { data: "sortorder", width: "60px",className:"center" },
        { data: "wholenm", editable: true},
        { data: "simnm", editable: true,},
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            //this.detailInfo = new PackageModel();
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
              var selectedText: string = "Local Language Setting";
              this.notification.confirmDialog(
                "Delete Local Language Setting Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .delete("mas-account-language/" + rowSelected.locallanguagegid)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
                          this.detailInfo = new LocalLanguageModel();
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

  searchData() {
    if (this.detailInfo.locallanguagegid == null) {
      return this.notification.showMessage("error","Please select Language");
    }
    this.reloadDatatable();
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
    console.log("detailInfo",this.detailInfo.createdtime);
    this.localLanguageService.updateLocalLanguge(this.detailInfo).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadDatatable();
      }
    });
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }


  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

}
