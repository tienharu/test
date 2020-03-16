import { Component, OnInit } from "@angular/core";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";

import { NgForm } from "@angular/forms";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";

import { LanguageListModel, KeywordLanguageModel } from "@app/core/models/language.model";
import { LanguageSettingService } from "@app/core/services/features.services/language-setting.service";

import { TitleCasePipe } from "@angular/common";
import { MultiLanguageService } from "@app/core/services/mutil-language.service";
import { SystemMenuService } from "@app/core/services/features.services/system-menu.service";
import { ProgramService, AuthService } from "@app/core/services";
import { BasePage } from "@app/core/common/base-page";
import { ProgramList } from "@app/core/common/static.enum";
import { I18nService } from "@app/shared/i18n/i18n.service";
@Component({
  selector: "sa-language-master",
  templateUrl: "./language-master.component.html",
  styleUrls: ["./language-master.component.css"],
})
export class LanguageMasterComponent extends BasePage implements OnInit {
  detailInfo: KeywordLanguageModel;
  options: any;
  otherLanguages: LanguageListModel[] = [];
  Programs: any[] = [];
  program2: any[];
  langType: any = [
    { key: "LBL", text: "Label" },
    { key: "MENU", text: "Menu" },
    { key: "BTN", text: "Button" },
    //{ key: "MSG", text: "Message" },
    { key: "DGRID", text: "Datatable" }
  ];

  tableCol: any[] = [
    { description: "Menu" },
    { description: "Type" },
    { description: "Keyword" }
  ];

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private languageService: LanguageSettingService,
    private multiLangService: MultiLanguageService,
    public programService: ProgramService,
    private menuService: SystemMenuService,
    public userService: AuthService,
    private i18nService: I18nService

  ) {
    super(userService);
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      lang_id: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      lang_id: {
        required: 'This field is required'
      }
    }
  };

  ngOnInit() {
    this.checkPermission(ProgramList.Language_Setting.valueOf())
    this.initModel();

    this.getPrograms().then(data => {
      this.Programs = data;
      this.program2 = this.Programs.filter(s => s.level == 2)
    });


    var allCountryLang = this.multiLangService.getCountryLangFromLocal();
    if (allCountryLang) {
      let langKey = [];
      for (var i = 0; i < allCountryLang.length; i++) {
        let l = new LanguageListModel();
        l.description = allCountryLang[i].lang_name;
        l.lang_cd = allCountryLang[i].lang_name.toUpperCase();
        this.otherLanguages.push(l);
        this.tableCol.push(l);
        langKey.push({ lang_key: l.lang_cd, lang_text: "" });

        $(`input[name='${l.lang_cd}']`).val("");
      }
      this.detailInfo.languages_data = langKey;

      // setTimeout(() => {
      //   this.otherLanguages.forEach(x => {
      //     $(`input[name='${x.lang_cd}']`).val("");
      //   });
      // }, 100);
    }
    else {
      alert('System error, please logout->login')
    }
    this.initDatatable();
  }


  initModel() {
    this.detailInfo = new KeywordLanguageModel();
    this.detailInfo.type = this.langType[0].key;
  }

  private getPrograms() {
    return this.menuService.listMenuOfCompany(1000);//fake
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.languageService.getAllLangsKeywords(null, null).then(res => {
          callback({
            aaData: res
          });
        })
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            //console.log(this.Programs);
            var c = this.Programs.filter(x => x.menu_id == data.program_cd);
            if (c.length > 0) return c[0].menu_name;
            else return "<i>Common Label</i>";
          },
          class: "lang-menu"
        },
        {
          data: (data, type, dataToSet) => {
            var c = this.langType.filter(x => x.key === data.type);
            if (c.length > 0) return c[0].text;
            else return "N/A";
          },
          class: "center lang-type"
        },
        {
          data: (data, type, dataToSet) => {
            return "<p title='" + data.lang_cd + "'>" + data.lang_cd + "</p>";
          }, class: "lang-cd"
        },
      ],
      ordering: false,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
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
            rowSelected.languages_data = "";
            //console.log(rowSelected);
            if (rowSelected) {
              var selectedText: string = rowSelected.lang_cd;
              this.notification.confirmDialog(
                "Delete Language Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.languageService.deleteKeywords([rowSelected.lang_cd])
                      .then(data => {
                        if (data.error) {
                          this.notification.showError(data.error.message);
                        } else {
                          this.notification.showSuccess("keyword deleted successfully");
                          this.reloadDatatable();
                        }
                      });
                  }
                }
              );
            }
          }
        },
        {
          extend: "copy",
          text: "Copy"
        },
        {
          extend: "csv",
          text: "Excel"
        },
        {
          extend: "pdf",
          text: "Pdf"
        },
        {
          extend: "print",
          text: "Print"
        }
      ]
    };
    this.otherLanguages.forEach(x => {
      this.options.columns.push({ data: x.lang_cd.toLowerCase(), class: "lang-value" })
    })

  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }

    this.detailInfo = event;
    if (
      this.detailInfo.program_cd == null ||
      this.detailInfo.program_cd == ""
    ) {
      this.detailInfo.program_cd = "0";
    }
    this.detailInfo.languages_data = JSON.parse(event.languages_data)
    console.log(this.detailInfo.languages_data)

    this.otherLanguages.forEach(x => {
      var langData = this.detailInfo.languages_data.filter(y => y.lang_key == x.lang_cd);
      if (langData.length) {
        $(`input[name='${x.lang_cd}']`).val(langData[0].lang_text);
      }
    });
  }

  onSubmit() {
    let valid = false;
    let langKey = [];
    this.otherLanguages.forEach(x => {
      var langText = $(`input[name='${x.lang_cd}']`).val();
      if (langText != "") valid = true;
      langKey.push({ lang_key: x.lang_cd, lang_text: langText });
    });
    if (!valid) {
      this.notification.showMessage("error", 'You have to input default language text');
      return;
    }
    this.detailInfo.languages_data = langKey;
    if (this.detailInfo.lang_id === 0) {
      this.languageService.addNewKeyword(this.detailInfo).then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
          this.multiLangService.refreshLanguageKey();
        }
      })

    } else {

      this.languageService.updateKeyword(this.detailInfo).then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
          this.multiLangService.refreshLanguageKey();
        }
      });
    }
  }

  onReset(f: NgForm) {
    $("form.frm-detail")
      .validate()
      .resetForm();

    let a1 = this.detailInfo.program_cd;
    let a2 = this.detailInfo.type;
    this.detailInfo = new KeywordLanguageModel();
    this.detailInfo.program_cd = a1;
    this.detailInfo.type = a2;

    this.otherLanguages.forEach(x => {
      $(`input[name='${x.lang_cd}']`).val("");
    });
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
    //this.onGetParent($(".language").val());
    $("form.frm-detail")
      .validate()
      .resetForm();
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
