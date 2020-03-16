import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { NgForm } from '@angular/forms';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CompanyFcService } from '@app/core/services/company-fc.service';
import { CompanyCfModel, ParentType, FsType, SpaceCompanyCfCodeModel, CopyCompanyCfCodeModel, SettingCompanyCfCodeModel } from '@app/core/models/company-cf.model';
import { ProgramList, Category } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
@Component({
  selector: 'sa-company-cf',
  templateUrl: './company-cf.component.html',
  styleUrls: ['./company-cf.component.css']
})
export class CompanyCfComponent extends BasePage implements OnInit {
  options: any;
  detailInfo: CompanyCfModel;
  detailUpdateCfInfo: SpaceCompanyCfCodeModel = new SpaceCompanyCfCodeModel();
  detailCopyCfInfo: CopyCompanyCfCodeModel = new CopyCompanyCfCodeModel();
  detailSettingCfInfo: SettingCompanyCfCodeModel;
  companies: any[] = [];
  parentCode: GeneralMasterModel[] = [];
  propertyCf: GeneralMasterModel[] = [];
  row5: any[] = ['1', '2', '3', '4', '5'];
  row7: any[] = ['1', '2', '3', '4', '5', '6', '7'];
  rowSpace: any[] = ['3', '4', '5', '6', '7', '8']
  ParentType: ParentType[] = [
    {
      name: "(+)",
      value: '1'
    },
    {
      name: "(-)",
      value: '2'
    },
    {
      name: "None",
      value: '3'
    }
  ]
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
  modalRef: BsModalRef;
  @ViewChild("popupCfUpdate") popupCfUpdate;
  //@ViewChild("popupCfSetting") popupCfSetting;
  isDisabled: boolean = false;
  companyIdBackup: number = 0;

  constructor(public programService: ProgramService,
    public userService: AuthService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private companyCfService: CompanyFcService,
    private generalMasterService: GeneralMasterService,
    private modalService: BsModalService,
    private i18nService: I18nService) {
    super(userService);
  }
  initModel() {
    if (this.companyIdBackup === 0) {
      this.detailInfo = this.companyCfService.getModel();
      this.detailInfo.is_system = this.userService.isSystemCompany();
      this.companyIdBackup = this.detailInfo.companyid = this.loggedUser.company_id;
    }
    else {
      this.detailInfo = this.companyCfService.getModel();
      //this.detailInfo.is_system=this.userService.isSystemCompany();
      this.detailInfo.companyid = this.companyIdBackup;
    }

  }

  ngOnInit() {
    this.checkPermission(ProgramList.Account_Master.valueOf())
    this.initModel();
    this.detailInfo.companyid = this.companyInfo.company_id;
    this.detailSettingCfInfo = new SettingCompanyCfCodeModel();
    // info update 
    this.detailUpdateCfInfo.companyid = this.companyInfo.company_id;
    this.detailUpdateCfInfo.fstype = "4";
    this.detailUpdateCfInfo.dsplspace = "4";

    // info copy
    this.detailCopyCfInfo.fromcompanycd = this.companyInfo.company_id;

    this.companies.push(this.companyInfo);
    this.getParentCode().then(data => {
      this.parentCode.push(...data);
    });
    this.getProperty().then(data => {
      this.propertyCf.push(...data);
    });
    this.initDatatable();
    $("#spinner-companycf").spinner();
    $("#form-spinner a").css("font-size", "8px");
    $("#form-spinner a").css("width", "15px");
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      companyscfcd: {
        required: true
      },
      acctkoreanm: {
        required: true
      },

     
    },
    // Messages for form validation
    messages: {
      companyscfcd: {
        required: "The length is 10 digits"
      },
      acctkoreanm: {
        required: "Please input value name"
      },
     
    }
  };

  private getParentCode() {
    return this.companyCfService.listCompanyCf();
  }

  private getProperty() {
    return this.generalMasterService.listGeneralByCate(Category.AcctProperty.valueOf());
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.companyCfService.listCompanyCf().then(data => {
          callback({
            aaData: data
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
            var o = this.FSTypes.filter(x => x.value === '4');
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "center", width: "100px"
        },
        { data: "sortorder", width: "150px",className:"center" },
        { data: "standardacctcd", width: "200px",className:"center" },
        { data: "companyscfcd", width: "200px",className:"center" },
        { data: "acctkoreanm", width: "350px" },
        { data: "acctengnm", width: "350px" },
        { data: "acctlevel", width: "100px",className:"center" },
        { data: "dsplspace", width: "100px",className:"center" },
        { data: "scfpropergid", width: "150px" },
        {
          data: (data, type, dataToSet) => {
            return data.finalyn ? "Yes" : "No";
          },
          className: "center",
          width: "50px"
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
            this.detailInfo = new CompanyCfModel();
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
              var selectedText: string = "SCF Companny";
              this.notification.confirmDialog(
                "Delete SCF Companny confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .delete("mas-scf-company/" + rowSelected.companyscfcd)
                      .subscribe(data => {
                        if (!data.success) {
                          this.notification.showMessage("error", data.data.message);
                        } else {
                          this.notification.showMessage(
                            "success",
                            "Deleted successfully"
                          );
                          this.reloadDatatable();
                          this.detailInfo = new CompanyCfModel();
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
      this.isDisabled = true;
    }, 100);
  }

  onSubmit() {
    this.detailInfo.sortorder = $("#spinner-companycf").spinner("value");
    if (this.detailInfo.createdtime =="") {
      this.companyCfService.insertCompanyCf(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.companyCfService.updateCompanyCf(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  settingAllCompanyCfInfo() {
    this.detailSettingCfInfo.settingtype = "1";
    this.detailSettingCfInfo.fstype = this.detailUpdateCfInfo.fstype;
    this.companyCfService.settingCompanyCf(this.detailSettingCfInfo).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
    });
  }

  settingNameCompanyCfInfo() {
    this.detailSettingCfInfo.settingtype = "2";
    this.detailSettingCfInfo.fstype = this.detailUpdateCfInfo.fstype;
    this.companyCfService.settingCompanyCf(this.detailSettingCfInfo).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
    });
  }

  updateSpace() {
    if (this.detailUpdateCfInfo.fstype != null && this.detailUpdateCfInfo.dsplspace != null) {
      this.companyCfService.spaceCompanyCf(this.detailUpdateCfInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
        }
      });
    }
  }

  copyCompanyCfInfo() {
    this.detailCopyCfInfo.fstype = this.detailUpdateCfInfo.fstype;
    if (this.detailCopyCfInfo.fstype == "") {
      this.notification.showMessage("error", "Please select FS type");
    }
    else if (this.detailCopyCfInfo.tocompanycd == 0) {
      this.notification.showMessage("error", "Please select to Company");
    }
    else {
      this.companyCfService.copyCompanyCf(this.detailCopyCfInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
        }
      });
    }
  }

  // openCompanyCfSettingPopup() {
  //   setTimeout(() => {
  //     let config = {
  //       keyboard: true,
  //       backdrop: true,
  //       ignoreBackdropClick: true
  //     };
  //     this.modalRef = this.modalService.show(this.popupCfSetting, config);
  //   }, 100);
  // }

  openCompanyCfUpdatePopup() {
    setTimeout(() => {
      let config = {
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true
      };
      if (this.detailUpdateCfInfo.fstype == "") {
        this.notification.showMessage("error", "Please select FS type");
      }
      else if (this.detailUpdateCfInfo.dsplspace == "") {
        this.notification.showMessage("error", "Please select Space");
      }
      else {
        this.modalRef = this.modalService.show(this.popupCfUpdate, config);
      }

    }, 100);
  }
  closeCompanyCfUpdatePopup() {
    this.modalRef && this.modalRef.hide();
  }

  closeCompanyCfSettingPopup() {
    this.modalRef && this.modalRef.hide();
  }

  cacelSpace() {
    this.modalRef && this.modalRef.hide();
  }
  onReset(f: NgForm) {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.companyCfService.resetModel();
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
