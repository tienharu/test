import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { NgForm } from '@angular/forms';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CompanyAcModel, FsTypeModel, DrCrModel, ParentModel, SpaceCompanyAcCodeModel, CopyCompanyAcCodeModel, SettingCompanyAcCodeModel } from '@app/core/models/company-ac.model';
import { CompanyAcService } from '@app/core/services/company-ac.service';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { SystemMenuModel } from '@app/core/models/system-menu.model';
import { userInfo } from 'os';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-company-ac',
  templateUrl: './company-ac.component.html',
  styleUrls: ['./company-ac.component.css']
})
export class CompanyAcComponent extends BasePage implements OnInit {
  options: any;
  relation: any[] = [];
  acFsTypes: FsTypeModel[] = [
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
    }
  ];

  DrCrType: DrCrModel[] = [
    {
      name: "Dr",
      value: '1'
    },
    {
      name: "Cr",
      value: '2'
    },
    {
      name: "None",
      value: '3'
    }
  ]

  ParentClsType: ParentModel[] = [
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
  detailInfo: CompanyAcModel;
  accountCompanyTable: CompanyAcModel[] = [];
  detailUpdateAcInfo: SpaceCompanyAcCodeModel;
  detailCopyAcInfo: CopyCompanyAcCodeModel;
  detailSettingAcInfo: SettingCompanyAcCodeModel;
  row5: any[] = ['1', '2', '3', '4', '5'];
  row7: any[] = ['1', '2', '3', '4', '5', '6', '7'];
  rowSpace: any[] = ['3', '4', '5', '6', '7', '8']

  accountLevel: GeneralMasterModel[] = [];
  spaceAcount: GeneralMasterModel[] = [];
  parentCode: GeneralMasterModel[] = [];
  accountClass: GeneralMasterModel[] = [];
  baClass: GeneralMasterModel[] = [];
  property: GeneralMasterModel[] = [];
  inventType: GeneralMasterModel[] = [];
  subSystem: SystemMenuModel[] = [];
  companies: any[] = [];
  modalRef: BsModalRef;
  fstypelocal: string = '';
  isDisabled: boolean = false;
  companyIdBackup: number = 0;

  @ViewChild("popupAcSetting") popupAcSetting;
  @ViewChild("popupAcUpdate") popupAcUpdate;

  constructor(public userService: AuthService,
    public programService: ProgramService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private companyAcService: CompanyAcService,
    private generalMasterService: GeneralMasterService,
    private modalService: BsModalService,
    private i18nService: I18nService) {
    super(userService);
  }
  initModel() {
    if (this.companyIdBackup === 0) {
      this.detailInfo = this.companyAcService.getModel();
      this.detailInfo.is_system = this.userService.isSystemCompany();
      this.companyIdBackup = this.detailInfo.companyid = this.loggedUser.company_id;
    }
    else {
      this.detailInfo = new CompanyAcModel();
      this.detailInfo.companyid = this.companyIdBackup;
    }

  }
 
  ngOnInit() {
    this.checkPermission(ProgramList.Account_Master.valueOf())
    this.initModel();
    this.detailUpdateAcInfo = new SpaceCompanyAcCodeModel();
    this.detailCopyAcInfo = new CopyCompanyAcCodeModel();
    this.detailSettingAcInfo = new SettingCompanyAcCodeModel();
    this.detailInfo.companyid = this.companyInfo.company_id;


    // info update 
    this.detailUpdateAcInfo.companyid = this.companyInfo.company_id;
    this.detailUpdateAcInfo.fstype = "1";
    this.detailUpdateAcInfo.dsplspace = "4";
    // info copy
    this.detailCopyAcInfo.fromcompanycd = this.companyInfo.company_id;
    // setting
    this.detailSettingAcInfo.companycode = this.companyInfo.company_id;



    this.companies.push(this.companyInfo);
    this.getParentCode().then(data => {
      this.parentCode.push(...data);
    });

    this.getAccountClass().then(data => {
      this.accountClass.push(...data);
    });

    this.getInventType().then(data => {
      this.inventType.push(...data);
    });

    this.getBaClass().then(data => {
      this.baClass.push(...data);
    });

    this.getSubSystem().then(data => {
      this.subSystem.push(...data);
    });

    this.getProperty().then(data => {
      this.property.push(...data);
    });

    this.initDatatable();
    $("#spinner-companyac").spinner();
    $("#form-spinner a").css("font-size", "8px");
    $("#form-spinner a").css("width", "15px");
  }


  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      companyacctcd: {
        required: true
      },
      acctkoreanm: {
        required: true
      },

      acctclassgid: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      companyacctcd: {
        required: "The length is 10 digits"
      },
      acctkoreanm: {
        required: "Please input value name"
      },
      acctclassgid: {
        required: "Please select account class"
      }
    }
  };


  private getParentCode() {
    return this.companyAcService.listCompanyAc(this.detailInfo.companyid);
  }

  private getAccountClass() {
    return this.generalMasterService.listGeneralByCate(Category.AccountClass.valueOf());
  }

  private getInventType() {
    return this.generalMasterService.listGeneralByCate(Category.InventType.valueOf());
  }

  private getBaClass() {
    return this.generalMasterService.listGeneralByCate(Category.BAClass.valueOf());
  }

  private getSubSystem() {
    return this.companyAcService.listSysMenu(3);
  }
  private getProperty() {
    return this.generalMasterService.listGeneralByCate(Category.AcctProperty.valueOf());
  }

 

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.companyAcService.listCompanyAc(this.detailInfo.companyid).then(data => {
          var fsTypeChange =this.detailUpdateAcInfo.fstype
          callback({
            aaData: data.filter(x => x.fstype == fsTypeChange)
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
            var o = this.acFsTypes.filter(x => x.value === data.fstype);
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "center", width: "100px"
        },
        { data: "sortorder", width: "150px" , className:"center" },
        { data: "standardacctcd", width: "200px", className:"center"},
        { data: "companyacctcd", width: "200px", className:"center"},
        { data: "acctkoreanm", width: "350px" },
        { data: "acctengnm", width: "350px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.DrCrType.filter(x => x.value === data.drcr);
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "center", width: "100px"
        },
        { data: "acctlevel", width: "100px",className:"center" },
        { data: "dsplspace", width: "100px",className:"center" },
        { data: "acctpropergid", width: "200px" },
        { data: "subsys", width: "200px" },
        {
          data: (data, type, dataToSet) => {
            return data.useyn ? "Yes" : "No";
          },
          className: "center",
          width: "50px"
        },
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new CompanyAcModel();
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
              var selectedText: string = "Company Account";
              this.notification.confirmDialog(
                "Delete Company Account Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .delete("mas-account-company/" + rowSelected.companyacctcd)
                      .subscribe(data => {
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

  onSelectedChange(){
    this.reloadDatatable();
  }

  onSubmit() {
    this.detailInfo.sortorder = $("#spinner-companyac").spinner("value");
    if (this.detailInfo.createdtime =="") {
      this.companyAcService.insertCompanyAc(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.companyAcService.updateCompanyAc(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  settingAllCompanyAcInfo() {
    this.detailSettingAcInfo.settingtype = "1";
    this.detailSettingAcInfo.fstype = this.detailUpdateAcInfo.fstype;
    this.companyAcService.settingCompanyAc(this.detailSettingAcInfo).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
      this.reloadDatatable();
    });
  }

  settingNameCompanyAcInfo() {
    this.detailSettingAcInfo.settingtype = "2";
    this.detailSettingAcInfo.fstype = this.detailUpdateAcInfo.fstype;
    this.companyAcService.settingCompanyAc(this.detailSettingAcInfo).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
      this.reloadDatatable();
    });
  }

  copyCompanyAccountInfo() {
    this.detailCopyAcInfo.fstype = this.detailUpdateAcInfo.fstype;
    if (this.detailCopyAcInfo.tocompanycd == 0) {
      this.notification.showMessage("error", "Please select to Company");
    }
    else {
      this.companyAcService.copyCompanyAc(this.detailCopyAcInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
        }
      });
    }
  }

  updateSpace() {
    if (this.detailUpdateAcInfo.fstype != "" && this.detailUpdateAcInfo.dsplspace != "") {
      this.companyAcService.spaceCompanyAc(this.detailUpdateAcInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
        }
      });
    }
  }

  openCompanyAcSettingPopup() {
    setTimeout(() => {
      let config = {
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalRef = this.modalService.show(this.popupAcSetting, config);
    }, 100);
  }

  openCompanyAcUpdatePopup() {
    setTimeout(() => {
      let config = {
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true
      };
      if (this.detailUpdateAcInfo.dsplspace == "") {
        this.notification.showMessage("error", "Please select Space");
      }
      else {
        this.modalRef = this.modalService.show(this.popupAcUpdate, config);
      }
    }, 100);
  }



  cancelSub() {
    this.modalRef && this.modalRef.hide();
  }

  onReset(f: NgForm) {

    $("form.frm-detail")
      .validate()
      .resetForm();
    this.companyAcService.resetModel();
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

  closeCompanyAcSettingPopup() {
    this.modalRef && this.modalRef.hide();
  }

  closeCompanyAcUpdatePopup() {
    this.modalRef && this.modalRef.hide();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
