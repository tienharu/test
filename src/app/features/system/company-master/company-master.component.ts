import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { CompanyModel } from "@app/core/models/company.model";
import { CompanyMasterService } from "@app/core/services/features.services/company-master.service";
import { NameValueModel } from "@app/core/models/name-value.model";
import { Category, ProgramList } from "@app/core/common/static.enum";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { GeneralMasterModel } from "@app/core/models/general_master.model";

import { PackageModel } from "@app/core/models/package.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BasePage } from "@app/core/common/base-page";
import { GeneralMasterService } from "@app/core/services/features.services/general-master.service";
import { ProgramService } from "@app/core/services/program.service";
import { AuthService } from "@app/core/services/auth.service";
import { I18nService } from "@app/shared/i18n/i18n.service";
@Component({
  selector: "sa-company",
  templateUrl: "./company-master.component.html",
  styleUrls: ["./company-master.component.css"]
})
export class CompanyMasterComponent extends BasePage implements OnInit, CanDeactivateGuard {
  @ViewChild("tplContractHistory") tplContractHistory;
  modalRef: BsModalRef;

  currencies: GeneralMasterModel[] = [];
  countries: GeneralMasterModel[] = [];
  relationshipTypes: GeneralMasterModel[] = [];
  bizCondition: GeneralMasterModel[] = [];
  bizType: GeneralMasterModel[] = [];
  packages: PackageModel[] = [];
  companyTypes: NameValueModel[] = [
    {
      name: "Corporate",
      value: 1
    },
    {
      name: "Private",
      value: 2
    }
  ];

  options: any;
  detailInfo: CompanyModel;
  companyId: number;
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private companyMasterService: CompanyMasterService,
    private generalMasterService: GeneralMasterService,
    public programService: ProgramService,
    private modalService: BsModalService,
    public userService: AuthService,
    private i18nService: I18nService

  ) {
    super(userService);
  }
  public currentTime() {
    var d = new Date();
    return d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
  }
  

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      company_local_nm: {
        required: true
      },
      company_eng_nm: {
        required: true
      },
      company_sim_name: {
        required: true
      },
      company_type: {
        required: true
      },
      currency_gen_cd: {
        required: true
      },
      country_gen_cd: {
        required: true
      },

      ceo_local_nm: {
        required: true
      },
      com_regist_num: {
        required: true
      },
      biz_regist_num: {
        required: true
      },
      biz_conditions_gen_cd: {
        required: true
      },
      biz_type_gen_cd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      company_local_nm: {
        required: "Please enter the company local name"
      },
      company_eng_nm: {
        required: "Please enter the company english name"
      },
      company_sim_name: {
        required: "Please enter the company simple name"
      },
      company_type: {
        required: "Please select a company type"
      },
      currency_gid: {
        required: "Please select a company currency"
      },
      country_gid: {
        required: "Please select a company country"
      },
      relationship_type_gid: {
        required: "Please select a company relationship type"
      }
    }
  };

  ngOnInit() {
    this.checkPermission(ProgramList.Register_Company.valueOf())
    this.detailInfo = this.companyMasterService.getModel();
    this.getCurrencies().then(data => {
      this.currencies.push(...data);
    });
    this.getCountries().then(data => {
      this.countries.push(...data);
    });
    this.getBizCondition().then(data => {
      this.bizCondition.push(...data);
    });
    this.getBizType().then(data => {
      this.bizType.push(...data);
    });
    this.getPackages().then(data => {
      this.packages.push(...data);
    });
    // this.getRelationshipTypes().then(data => {
    //   // trick to avoid null array.
    //   setTimeout(() => {
    //     this.relationshipTypes.push(...data);
    //     console.debug( this.relationshipTypes);
    //   }, 200);
    // });
    this.initDatatable();
  }
  private getPackages() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/package/list/`).subscribe(data => {
        // console.debug(
        //   `getPackages done: ${this.currentTime()}\n ${JSON.stringify(data)}`
        // );
        if (!data.success) {
          this.notification.showMessage("error", data.message);
          data.data = [];
        }
        resolve(data.data);
      });
    });
  }
  private getCurrencies() {
    return this.generalMasterService.listGeneralByCate(Category.CurrencyCateCode.valueOf())
  }

  private getCountries() {
    return this.generalMasterService.listGeneralByCate(Category.CountryCateCode.valueOf())
  }
  private getBizCondition() {
    return this.generalMasterService.listGeneralByCate(Category.BusinessConditionCateCode.valueOf())
  }
  private getBizType() {
    return this.generalMasterService.listGeneralByCate(Category.BusinessCategoryCateCode.valueOf())
  }
  private getRelationshipTypes() {
    return this.generalMasterService.listGeneralByCate(Category.CompanyRelationshipType.valueOf())
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.companyMasterService.listCompany().then(data => {
          Promise.all([
            this.getBizType,
            this.getCountries,
            this.getBizCondition,
            this.getCurrencies,
            this.getPackages
          ]).then(res => {
            callback({
              aaData: data
            });
          });
        });
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            //return '<button class="btn btn-default btn-sm popup" data-company_id="'+data.company_id+'" title="All Contract" >'+(0)+'</button>';
            return (
              '<a href="javascript:;" class="popup" data-company_id="' +
              data.company_id +
              '" title="Company Contracts"><i class="fa fa-list-ul "></i></a> | <a href="javascript:;" class="create-data" data-company_id="' +
              data.company_id +
              '" title="Create Default Data"><i class="fa fa-sitemap "></i></a>'
            );
          },
          className: "center"
        },
        { data: "company_id", className: "center" },
        { data: "company_local_nm" },
        { data: "company_eng_nm" },
        { data: "company_sim_nm" },
        {
          data: (data, type, dataToSet) => {
            var o = this.packages.filter(x => x.pack_id === data.pack_id);
            if (o.length > 0) return o[0].pack_nm;
            else return "N/A";
          }
        },
        { data: "com_regist_num" },
        { data: "ceo_local_nm" },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center"
        },
        { data: "creator", className: "", width:"100px" },
        {
          data: "created_time",
          className: "center"
        },
        { data: "changer", className: "", width:"100px" },
        {
          data: "changed_time",
          className: "center"
        }
      ],
      // scrollY: 350,
      // scrollX: true,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new CompanyModel();
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
              var selectedText: string = rowSelected.company_eng_nm;
              this.notification.confirmDialog(
                "Delete company confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.companyMasterService.deleteCompany(rowSelected)
                      .then(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
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
    setTimeout(() => {
      $(".tbl-company-list").on("click", ".popup", e => {
        e.preventDefault();
        this.companyId = $(e.target)
          .parent()
          .data("company_id");
        this.openContractHistoryPopup();
      });

      $(".tbl-company-list").on("click", ".create-data", e => {
        e.preventDefault();
        let companyId = $(e.target)
          .parent()
          .data("company_id");

        this.notification.confirmDialog(
          "Create company data!",
          `Are you sure to create default data?`,
          x => {
            if (x) {
              this.companyMasterService.registerDefaultAuthorData(companyId).then(data => {
                if (!data.success) {
                  this.notification.showMessage("error", data.data.message);
                } else {
                  this.notification.showMessage("success", data.data.message);
                }
              });
            }
          }
        );
      });
    }, 500);
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
    if (this.detailInfo.company_id === 0) {
      this.companyMasterService.insertCompany(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.companyMasterService.updateCompany(this.detailInfo).then(data => {
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
    this.companyMasterService.resetModel();
    this.detailInfo = this.companyMasterService.getModel();
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.companyMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  openContractHistoryPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.tplContractHistory, config);
  }
  closePopupContract() {
    this.modalRef && this.modalRef.hide();
    this.reloadDatatable();
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
