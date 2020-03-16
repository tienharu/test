import { Component, OnInit } from '@angular/core';
import { ProgramService, NotificationService, CRMSolutionApiService, AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { LocalDataSource } from 'ng2-smart-table/lib/data-source/local/local.data-source';
import { CustomRenderSmartTableTransactionSelect2Component } from './transaction-select-editor.component';
import { LedgerTypeModel, TransactionBoxModel } from '@app/core/models/transaction-box.model';
import { TransactionBoxService } from '@app/core/services/transaction-box.service';
import { CompanyAcService } from '@app/core/services/company-ac.service';
import { CompanyFcService } from '@app/core/services/company-fc.service';
import { WipMasterService } from '@app/core/services/features.services/wip-master.service';
import { BasePage } from '@app/core/common/base-page';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { SystemMenuModel } from '@app/core/models/system-menu.model';
import { CommonFunction } from "@app/core/common/common-function";
import * as _ from "lodash";
@Component({
  selector: 'sa-transaction-code-box',
  templateUrl: './transaction-code-box.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss', './transaction-code-box.component.css'],
  entryComponents: [
    CustomRenderSmartTableTransactionSelect2Component
  ]
})

export class TransactionCodeBoxComponent extends BasePage implements OnInit {
  options: any;
  dateTimeNow: string;
  userName: any;
  valueTransGroup: any;
  valueApproval: any;
  source: LocalDataSource = new LocalDataSource;
  detailInfo: TransactionBoxModel;
  transCdList: any = [];
  comAcList: any = [];
  comFcList: any = [];
  budgetList: any = [];
  bizUnits:any = [];
  transGroup: GeneralMasterModel[] = [];
  approvalType: GeneralMasterModel[] = [];
  fieldSystem: SystemMenuModel[] = [];
  acFsTypes: LedgerTypeModel[] = [
    {
      name: "GLP",
      value: '1'
    },
    {
      name: 'GLP-Outgoing',
      value: '2'
    },
    {
      name: "CLP-Incoming",
      value: '3'
    },
    {
      name: "CLP-Petty",
      value: '4'
    },
    {
      name: "FLP",
      value: '5'
    }
  ];
  DrCrType = [
    {
      value: '1',
      title: "Dr",
    },
    {
      value: '2',
      title: "Cr",
    }
  ]
  listInOut = [
    { value: 1, title: "+" },
    { value: 0, title: "-" },
  ];
  settings: any = {
    actions: {
      position: 'right',
      add: true,
      columnTitle: ''
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: 'Delete',
      class: 'center',
    },
    add: {
      confirmCreate: true,
      addButtonContent: 'Add <i class="fa fa-plus"></i>',
      createButtonContent: 'Create',
      cancelButtonContent: 'Cancel',
      class: 'center',
    },
    edit: {
      confirmSave: true,
      editButtonContent: 'Edit',
      saveButtonContent: 'Update',
      cancelButtonContent: 'Cancel',
      class: 'center',
    },
  };

  constructor(public programService: ProgramService,
    public userService: AuthService,
    private notification: NotificationService,
    private i18nService: I18nService,
    private api: CRMSolutionApiService,
    private generalMasterService: GeneralMasterService,
    private transactionBoxService: TransactionBoxService,
    private companyAcService: CompanyAcService,
    private companyFcService: CompanyFcService,
    private wipMasterService: WipMasterService) {
    super(userService);
  }

  ngOnInit() {
    var self = this;
    self.checkPermission(ProgramList.Transaction_Code.valueOf())
    self.detailInfo = new TransactionBoxModel();
    self.detailInfo.companyid = self.companyInfo.company_id;
    self.userName = self.userService.getUserInfo();
    self.dateTimeNow = new Date().toString('yyyy-MM-dd');
    self.initDatatable();
    return self.initCommonData().then(function () {
      self.tableTransactionComponent();
      $("#spinner-sort").spinner();
      $("#form-spinner a").css("font-size", "8px");
      $("#form-spinner a").css("width", "15px");
      setTimeout(function(){
          $('.transaction-component-table .ng2-smart-filters').hide();
      },1000);
      setTimeout(function () {
        $('ng2-smart-table table.transaction-component-table thead .ng2-smart-titles').css("display", "none");
        $('ng2-smart-table table.transaction-component-table thead').prepend('<tr class="ng2-smart-titles-custom-1"><th id="custom-th1"></th><th id="custom-th2">Name</th><th id="custom-th3">Code</th></tr>');
        $('ng2-smart-table table.transaction-component-table thead').prepend('<tr class="ng2-smart-titles-custom"><th rowspan="2">No</th><th colspan="3" >Account</th><th rowspan="2">DrCr</th><th rowspan="2" >Unit</th><th rowspan="2" >SCF Name</th><th rowspan="2" >+/-</th><th  rowspan="2" >Budget Name</th><th  rowspan="2" >+/-</th><th rowspan="2" >Comment</th><th rowspan="2"></th></tr>');
      }, 500);
    });
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      transgroupgid: {
        required: true
      },
      transkoreanm: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      transgroupgid: {
        required: "Please select trans group"
      },
      transkoreanm: {
        required: "Please input value name"
      }
    }
  };


  onChangeTransGroup() {
    var x = $("#selectTrans").valueOf();
    this.valueTransGroup = x[0].value;
  }

  onChangeApproval() {
    var y = $("#selectApproval").valueOf();
    this.valueApproval = y[0].value;
  }

  onSubmit() {
    this.detailInfo.sortorder = $("#spinner-sort").spinner("value");
    this.detailInfo.companyid = this.companyInfo.company_id;
    if (this.detailInfo.createdtime == "") {
      this.transactionBoxService.insertTranSaction(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.transactionBoxService.updateTranSaction(this.detailInfo).then(data => {
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
      $('.transaction-component-table .ng2-smart-filters').show();
      this.detailInfo = event;
      return this.getFinancialCodeSetting(event.transid);
    }, 100);
  }

  onReset() {
    $("form.frm-detail").validate().resetForm();
    this.detailInfo = new TransactionBoxModel();
    this.transCdList = [];
    this.tableTransactionComponent();
    $('.transaction-component-table .ng2-smart-filters').hide();
    this.reloadDatatable();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  onCreateConfirm(event) {
    var self = this;
    self.notification.showCenterLoading();
    var data = event.newData;
    data.id = CommonFunction.generateId();
    data.account = "S";
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.companyacctcd_valid) {
      self._notifyInValidField('companyacctcd_0', false, 'select');
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('companyacctcd_0', true, 'select');

    data.transid = self.detailInfo.transid;
    data.companyid = self.detailInfo.companyid;
    data.budgetCd = Number(data.budgetCd) || 0;
    return self.transactionBoxService.insertTransFinancialCodeSetting(data).then(function (rs) {
      self.notification.hideCenterLoading();
      if (rs && rs.success) {
        self.notification.showSuccess(rs.messages || 'Create successful.');
        event.confirm.resolve(data);
      } else {
        self.notification.showError(rs.messages || 'Create has error. Please try again later.')
      }
    });
  }

  onSaveConfirm(event) {
    var self = this;
    self.notification.showCenterLoading();
    var data = event.newData;
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.companyacctcd_valid) {
      self._notifyInValidField('companyacctcd_0', false, 'select');
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('companyacctcd_0', true, 'select');
    data.budgetCd = Number(data.budgetCd) || 0;
    return self.transactionBoxService.updateTransFinancialCodeSetting(data).then(function (rs) {
      self.notification.hideCenterLoading();
      if (rs && rs.success) {
        self.notification.showSuccess(rs.messages || 'Update successful.');
        event.confirm.resolve(data);
        return self.getFinancialCodeSetting(data.transid);
      } else {
        self.notification.showError(rs.messages || 'Update has error. Please try again later.')
      }
    });
  }

  onDeleteConfirm(event) {
    var self = this;
    var data = event.data;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Row Material ?",
        content: "Are you want to delete this row material?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          self.notification.showCenterLoading();
          return self.transactionBoxService.deleteTransFinancialCodeSetting(data.transid, data.transseq).then(function (rs) {
            self.notification.hideCenterLoading();
            if (rs && rs.success) {
              self.notification.showSuccess(rs.messages || 'Delete successful.');
              event.confirm.resolve(data);
            } else {
              self.notification.showError(rs.messages || 'Delete has error. Please try again later.')
            }
          });
        }
      }
    );
  }

  private checkValidTableInput(data) {
    var result = {
      companyacctcd_valid: data.companyacctcd && (data.companyacctcd + '').trim() !== '',
    };
    return result;
  }

  private _notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.transactionBoxService.listTranSaction().then(data => {
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
            var o = this.transGroup.filter(x => x.gen_cd === data.transgroupgid);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "center", width: "200px"
        },
        { data: "sortorder", width: "150px", className: "center" },
        { data: "transkoreanm", width: "200px", className: "center" },
        { data: "transengnm", width: "200px", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var o = this.acFsTypes.filter(x => x.value === data.lptype);
            if (o.length > 0) return o[0].name;
            else return "N/A";
          }, className: "center", width: "200px"
        },
        { data: "aprvllinecd", width: "150px" },
        {
          data: (data, type, dataToSet) => {
            return data.useyn ? "Yes" : "No";
          },
          className: "center",
          width: "60px"
        },
        { data: "programid", width: "60px" },
      ],
      scrollY: 210,
      scrollX: true,
      paging: true,
      pageLength: 25,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new TransactionBoxModel();
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
              var selectedText: string = "Transaction-code";
              this.notification.confirmDialog(
                "Delete Transaction-code  Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.api
                      .delete("mas-transbox/" + rowSelected.transid)
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

  private tableTransactionComponent() {
    this.settings = {
      actions: {
        position: 'right',
        add: true,
        columnTitle: ''
      },
      delete: {
        confirmDelete: true,
        deleteButtonContent: 'Delete',
        class: 'center',
      },
      add: {
        confirmCreate: true,
        addButtonContent: 'Add <i class="fa fa-plus"></i>',
        createButtonContent: 'Create',
        cancelButtonContent: 'Cancel',
        class: 'center',
      },
      edit: {
        confirmSave: true,
        editButtonContent: 'Edit',
        saveButtonContent: 'Update',
        cancelButtonContent: 'Cancel',
        class: 'center',
      },
      columns: {
        index: {
          title: this.i18nService.getTranslation('NO'),
          class: 'center',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction(value, row, cell) { return cell.row.index + 1; }
        },
        account: {
          title: this.i18nService.getTranslation('S'),
          class: 'center',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction(value, row, cell) { return 'S' }
        },
        companyacctcd: {
          title: this.i18nService.getTranslation('Name'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.comAcList, (r) => {
                return { id: r.companyacctcd, text: r.acctkoreanm + " - " + r.acctengnm }
              })
            }
          },
          valuePrepareFunction: (cell, row) => {
            var comAcc = _.find(this.comAcList, function (a) {
              return a.companyacctcd === row.companyacctcd;
            });
            return comAcc ? comAcc.acctkoreanm + "-" + comAcc.acctengnm : '';
          }
        },
        companyacctcd_id: {
          title: this.i18nService.getTranslation('Code'),
          class: 'center',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => { return row.companyacctcd || '' }
        },
        drcr: {
          title: this.i18nService.getTranslation('Spec_Width'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.DrCrType, (r) => {
                return { id: r.value, text: r.title }
              })
            }
          },
          valuePrepareFunction: (value) => {
            return value === '2' ? 'Dr' : 'Cr';
          }
        },
        bizunittypegid: {
          title: this.i18nService.getTranslation('UNIT'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.bizUnits, (r) => {
                return { id: r.global_unit_id, text: r.global_unit_nm }
              })
            }
          },
          valuePrepareFunction: (cell, row) => {
            var bitUnit = _.find(this.bizUnits, function (b) {
              return parseInt(b.global_unit_id) === parseInt(row.bizunittypegid);
            });
            return bitUnit ? bitUnit.global_unit_nm : '';
          }
        },
        companyscfcd: {
          title: this.i18nService.getTranslation('SCF_NAME'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.comFcList, (r) => {
                return { id: r.companyscfcd, text: r.acctkoreanm + " - " + r.acctengnm }
              })
            }
          },
          valuePrepareFunction: (cell, row) => {
            var comFC = _.find(this.comFcList, function (a) {
              return a.companyscfcd === row.companyscfcd;
            });
            return comFC ? comFC.acctkoreanm + " - " + comFC.acctengnm : '';
          }
        },
        scfsumvalue: {
          title: this.i18nService.getTranslation('+/-'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.listInOut, (r) => {
                return { id: r.value, text: r.title }
              })
            }
          },
          valuePrepareFunction: (value: any) => { return value === 0 ? '+' : '-' }
        },
        budgetcd: {
          title: this.i18nService.getTranslation('BUDGET_NAME'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.budgetList, (r) => {
                return { id: r.budgetCd, text: r.budgetKoreaNm }
              })
            }
          },
          valuePrepareFunction: (cell, row) => {
            var budget = _.find(this.budgetList, function (a) {
              return a.budgetCd === row.budgetCd;
            });
            return (budget && budget.budgetKoreaNm) || '';
          }
        },
        budgetsumvalue: {
          title: this.i18nService.getTranslation('+/-'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableTransactionSelect2Component,
            config: {
              list: _.map(this.listInOut, (r) => {
                return { id: r.value, text: r.title }
              })
            }
          },
          valuePrepareFunction: (value: any) => { return value === 0 ? '+' : '-' }
        },
        remark: {
          title: this.i18nService.getTranslation('Remark'),
          type: 'text',
          class: 'center',
          filter: false,
          valuePrepareFunction: (value: any) => { return value }
        }
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header transaction-component-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };
    
    this.source.load(this.transCdList || []);
  }

  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
  }

  private initCommonData() {
    return Promise.all([this.getTransGroup(), this.getApprovalType(), this.getFieldSystem(), this.getBudget(), this.listCompanyAc(), this.listCompanyFc(), this.getBizUnit()]);
  }

  private getTransGroup() {
    return this.generalMasterService.listGeneralByCate(Category.TransGroupCateCode.valueOf()).then(data => this.transGroup.push(...data));
  }

  private getApprovalType() {
    return this.transactionBoxService.listApprovalLine().then(data => this.approvalType.push(...data))
  }

  private getFieldSystem() {
    return this.transactionBoxService.listSysMenu(3).then(data => this.fieldSystem.push(...data))
  }

  private getBudget() {
    return this.transactionBoxService.getBudgetCodeList().then(data => this.budgetList.push(...data));
  }

  private listCompanyAc() {
    return this.companyAcService.listCompanyAc(this.companyInfo.company_id).then(data => this.comAcList.push(...data));
  }

  private listCompanyFc() {
    return this.companyFcService.listCompanyCf().then(data => this.comFcList.push(...data));
  }

  private getBizUnit() {
    return this.wipMasterService.listGlobalByType().then(data => this.bizUnits.push(...data));
  }

  private getFinancialCodeSetting(transid){
    var self = this;
    return self.transactionBoxService.getListByTransId(transid).then(function(rs){
      if(rs.success){
        self.transCdList = _.map(rs.data, function (item, index) {
          item.index = index + 1;
          item.id = CommonFunction.generateId();
          return item;
        });
      }
      self.source.load(self.transCdList);
    });
  }
}


