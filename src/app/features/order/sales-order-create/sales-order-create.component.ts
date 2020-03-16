import { Component, OnInit, ɵConsole } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { SaleOrderCreateModel } from '@app/core/models/sale-order-create.model';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { SaleOrderCreateService } from '@app/core/services/features.services/sale-order-create.service';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';
import _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomRenderSmartTableProcessInputComponent } from './process-input-editor.component';
import { CustomRenderSmartTableProcessInputDatetimeComponent } from './process-input-datetime.component';
import { CustomRenderSmartTableProcessCheckboxComponent } from './process-checkbox-editor.component';
import { CustomRenderSmartTableProcessSelectComponent } from './process-select-editor.component';
import { CustomRenderSmartTableSaleOrderSelect2Component } from './sale-order-select-editor-2.component';
import { MaterialMasterPopupService } from '@app/core/services/features.services/material-master-popup.service';
import { CustomerMaterialModel } from '@app/core/models/customer-material.model';
import { CustomRenderSmartTableInputComponent } from './smart-table-input.component';
import { CustomRenderSmartTableProcessInputItemizedComponent } from './process-input-itemized.component';
import { ItemMasterModel } from '@app/core/models/item-master.model';
import { SaleOrderCreateDetailModel } from '@app/core/models/sale-order-create-detail.model';
import { CustomRenderSmartTableProcessInputMPSComponent } from './process-input-mps.component';
import { CLIENT_RENEG_WINDOW } from 'tls';
import { ContactorLessModel } from '@app/core/models/crm/expenses-magt.model';
import { Row } from 'ng2-smart-table/lib/data-set/row';

@Component({
  selector: 'sa-sales-order-create',
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.css'],
  entryComponents: [
    CustomRenderSmartTableProcessInputComponent, CustomRenderSmartTableProcessInputMPSComponent, CustomRenderSmartTableProcessInputItemizedComponent, CustomRenderSmartTableInputComponent, CustomRenderSmartTableProcessSelectComponent, CustomRenderSmartTableProcessInputDatetimeComponent, CustomRenderSmartTableSaleOrderSelect2Component, CustomRenderSmartTableProcessCheckboxComponent
  ]
})
export class SalesOrderCreateComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  options: any;
  cateId: any;
  isFilterGrid: boolean = true;
  //--------------------BEGIN---------------------------------------------
  detailInfo: SaleOrderCreateModel;
  //-----------Global Master----------------------------------------------
  customers: CustomerMaterialModel[] = [];
  customerName: any = [];
  bizUnits: GlobalMasterModel[] = [];
  //-----------General Master---------------------------------------------
  currencys: GeneralMasterModel[] = [];
  taxs: GeneralMasterModel[] = [];
  paymentTerms: GeneralMasterModel[] = [];
  stockTypes: GeneralMasterModel[] = [];
  stockUnits: GeneralMasterModel[] = [];
  terms: GeneralMasterModel[] = [];
  itemizeds: GeneralMasterModel[] = [];
  //-----------TABLE------------------------------------------------------
  pathsSource: LocalDataSource = new LocalDataSource();
  // settingsPath: object = {};
  digitRegx: RegExp = /^(0|[1-9][0-9]*)$/;
  min_maxRegex: RegExp = /^([1-9]|[1-8][0-9]|9[0-9]|100)$/;
  paths: any = [];
  pathRouteSource: LocalDataSource = new LocalDataSource();
  pathRoutes: any = [];
  itemizedNames: ItemMasterModel[] = [];
  detailInforTable: SaleOrderCreateDetailModel;

  saleTableSource: SaleOrderCreateDetailModel[] = [];
  selectDestinationGenCd = '';
  listDes = [{ value: "Ha Noi", title: "Ha Noi" },
  { value: "Tokyo", title: "Tokyo" },
  { value: "Seoul", title: "Seoul" }
  ];
  listCancelReasons = [{ value: "Out Stock", title: "Out Stock" },
  { value: "Unknow", title: "Unknow" },
  { value: "Instock", title: "Instock" }
  ];
  //------------COPY TABLE-------------------------------------------------
  deliveryCopy: string;
  saleNoReUse: string;
  dueDateCopy: string;
  poCopy: number = 1;
  poNoCopy: string;
  detailInforTableCopy: SaleOrderCreateDetailModel;
  checkSaleOrderDetail: any = [];
  checkInsertTable: boolean = false;
  detailTableToSave: SaleOrderCreateDetailModel[] = [];
  detailTableToShow: SaleOrderCreateDetailModel[] = [];
  lengthDataPathRoute: number = 0;
  lengthDataAfterInsert: number = 0;
  saleOrderCdCurent: string = '';

  //sample datas:
  currentIndex: number = 0;
  settingsPath: any = {
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
  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public materialMasterPopupService: MaterialMasterPopupService,
    public saleOrderCreateService: SaleOrderCreateService,
    private globalMasterService: GlobalMasterService,
    private _sanitizer: DomSanitizer,
    private generalMasterService: GeneralMasterService) {
    super(userService);
    this.cate_cd = Category.OrgCateCode;
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      cate_cd: {
        required: true
      },
      general_nm: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      cate_cd: {
        required: "Please select the category"
      },
      general_nm: {
        required: "Please enter the general name"
      },
    }
  };
  ngOnInit() {
    this.checkPermission(ProgramList.Sale_Create_Order.valueOf())
    this.detailInfo = this.saleOrderCreateService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.initPathTable();
    //sample datas:
    // this.currentIndex = 0;
    // this.initTestData();
    return Promise.all([
      this.getCustomer(),
      this.getBizUnit(),
      this.getCurrency(),
      this.getTax(),
      this.getPayMentTerm(),
      this.getStockType(),
      this.getTerm(),
      this.getItemizedName(),
      this.getItemized(),
      this.getStockUnit(),
    ]).then(res => {
      this.customers.push(...res[0]);
      this.customerName = this.customers;
      this.bizUnits.push(...res[1]);
      this.currencys.push(...res[2]);
      this.taxs.push(...res[3]);
      this.paymentTerms.push(...res[4]);
      this.stockTypes.push(...res[5]);
      this.terms.push(...res[6]);
      this.itemizedNames.push(...res[7]);
      this.itemizeds.push(...res[8]);
      this.stockUnits.push(...res[9]);

      $('ng2-smart-table .process-path-table thead tr:first').before(
        '<tr><th style="min-width:40px;background: #6D6C6E">Del</th>' +
        // '<th style ="min-width:40px;background: #6D6C6E">No</th>'+
        '<th style ="min-width:580px;background: #6D6C6E ;height:35px;">' + this.i18nService.getTranslation('SO_OR_DELIVERY') + '</th>' +
        '<th style ="min-width:600px;background: #6D6C6E">' + this.i18nService.getTranslation('SO_OR_ITEM') + '</th>' +
        '<th style ="min-width:320px;background: #6D6C6E">' + this.i18nService.getTranslation('SO_OR_STOCK') + '</th>' +
        '<th style ="min-width:310px;background: #6D6C6E">' + this.i18nService.getTranslation('SO_OR_AMOUNT') + '</th>' +
        '<th style ="min-width:700px;background: #6D6C6E">' + this.i18nService.getTranslation('SO_PRE_COST') + '</th>' +
        // '<th style ="min-width:100px;background: #6D6C6E">MPS</th>'+
        // '<th style ="width:200px;background: #6D6C6E"></th>' +
        '<th style ="width:200px;background: #6D6C6E">Actions</th></tr>');
        //this.getDataTableDetail("dc8d9392-056a-44c3-98fc-3d40f7fe06b8");

    });
  }
  private getParents(value) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`sysgeneral/details/catecd/${value}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }
  onGetParent(value, event) {
    this.getParents(value).then(data => {
      this.parents.push(...data);
    }).then(() => {
      this.detailInfo = event;
    })
  }
  onCateChange(cateId) {
    if (this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }
  onSubmit() {
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.changedTime = new Date().toString('yyyy-MM-dd');
    this.detailInfo.createdTime = new Date().toString('yyyy-MM-dd');
    this.detailInfo.times = parseInt(this.detailInfo.times.toString());
    this.detailInfo.deliveryYmd = this.detailInfo.changedTime;
    this.detailInfo.dueDateYmd = this.detailInfo.changedTime;
    if (this.detailInfo.salesOrderCd === '') {
      this.saleOrderCreateService.insertSaleOrderCreate(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.detailInfo.salesOrderCd = data.data.salesOrderCd;
          this.detailInfo.createdTime = CommonFunction.formatDate(data.data.createdTime);
          this.detailInfo.changedTime = data.data.changedTime;
          this.detailInfo.salesOrderSeq = data.data.salesOrderSeq;
          this.detailInfo.salesOrderNo = data.data.salesOrderNo;
          this.subtractSaleOrderNo();
          this.onCopy();
          this.initPathTable();
        }
      });
    } else {
      this.saleOrderCreateService.updateSaleOrderCreate(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          //this.detailInforTable.SalesOrderCdNavigation = this.detailInfo;
          this.initPathTable();
          this.onCopy();
          this.reloadDatatable();
        }
      });
    }
  }
  subtractSaleOrderNo() {
    let fromIndex = this.detailInfo.salesOrderNo.trim().lastIndexOf("-");
    this.saleNoReUse = this.detailInfo.salesOrderNo.trim().substring(0, fromIndex) + this.detailInfo.salesOrderNo.trim().substring(fromIndex + 1);
  }
  onCopy() {
    this.deliveryCopy = this.detailInfo.deliveryYmd;
    this.dueDateCopy = this.detailInfo.dueDateYmd;
    this.poNoCopy = this.saleNoReUse + "-01";
    this.poCopy = 1;
  }
  onCopyFromData(data:SaleOrderCreateDetailModel[]){
    let lengthDataFromServe : number = data.length;
    this.deliveryCopy = data[0].deliveryYmd;
    this.dueDateCopy = data[lengthDataFromServe-1].dueDateYmd;
    this.poNoCopy = data[lengthDataFromServe-1].poNo;
    this.poCopy = data[lengthDataFromServe-1].po;
    this.detailInfo.deliveryYmd = data[0].deliveryYmd;
    this.detailInfo.dueDateYmd = data[lengthDataFromServe-1].dueDateYmd;
  }
  onReset() {
    this.detailInfo = new SaleOrderCreateModel;
    this.detailInforTable = new SaleOrderCreateDetailModel;
    this.pathsSource = new LocalDataSource();
    this.checkInsertTable = false;
    this.deliveryCopy = "";
    this.dueDateCopy = "";
    this.poNoCopy = "";
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
  private getCustomer() {
    return this.materialMasterPopupService.getCustomer();

  }
  private getBizUnit() {
    return this.globalMasterService.listGlobalByType();
  }
  private getCurrency() {
    return this.generalMasterService.listGeneralByCate(Category.CurrencyCateCode.valueOf());
  }
  private getTax() {
    return this.generalMasterService.listGeneralByCate(Category.Tax.valueOf());
  }
  private getPayMentTerm() {
    return this.generalMasterService.listGeneralByCate(Category.PaymentTerm.valueOf());
  }
  private getStockType() {
    return this.generalMasterService.listGeneralByCate(Category.StockType.valueOf());
  }
  private getTerm() {
    return this.generalMasterService.listGeneralByCate(Category.SaleTerms.valueOf());
  }
  private getItemizedName() {
    return this.saleOrderCreateService.listItemMasterAll();
  }
  private getItemized() {
    return this.generalMasterService.listGeneralItemizedByItem();

  }
  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }
  private initPathTable() {
    var freeYn = [{ value: true, title: 'Yes' }, { value: false, title: 'No' }]
    this.settingsPath = {
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
        createButtonContent: 'Add',
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
      // selectMode: 'multi',
      columns: {
        delYn: {
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessCheckboxComponent },
          valuePrepareFunction: (value, row) => {
            let cbkHtml = value ? '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox" attr-id="' + row.salesOrderDetailCd + '"  checked </input><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox"  attr-id="' + row.salesOrderDetailSeq + '" ></input><i></i></label>';
            return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          }
        },
        salesOrderDetailSeq: {
          title: 'No',
          type: 'text',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        deliveryYmd: {
          title: this.i18nService.getTranslation('SO_DELIVERY'),
          type: 'text',
          class: 'center',
          defaultValue: this.deliveryCopy,
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputDatetimeComponent },
        },
        po: {
          title: 'PO',
          type: 'string',
          class: 'center',
          defaultValue: this.poCopy,
          filter: false,
        },
        poNo: {
          title: 'PO No',
          type: 'html',
          class: 'center',
          defaultValue: this.poNoCopy,
          filter: false,
        },
        destination: {
          title: this.i18nService.getTranslation('SO_DESTINATION'),
          type: 'string',
          class: 'center',
          filter: false,
          editable: false,
          addable: true,
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.listDes
            },
          },
        },
        itemNm: {
          title: this.i18nService.getTranslation('SO_ITEMNAME'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputItemizedComponent, config: { list: this.itemizedNames } },

        },
        itemizedGenCd: {
          title: this.i18nService.getTranslation('SO_ITEMIZED'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            var itemizedGenCdNameFrom = _.find(this.itemizeds, { "gen_cd": row.itemizedGenCd });
            return itemizedGenCdNameFrom.gen_nm;
          }
        },
        stockUnitGenCd: {
          title: this.i18nService.getTranslation('SO_UNIT'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            var stockUnitGenNameFrom = _.find(this.stockUnits, { "gen_cd": row.stockUnitGenCd });
            return stockUnitGenNameFrom.gen_nm;
          }
        },
        bizUnitId: {
          title: this.i18nService.getTranslation('SO_BIZUNIT'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            var bizUnitIdNameFrom = _.find(this.bizUnits, { "global_unit_id": parseInt(row.bizUnitId) });
            return bizUnitIdNameFrom.global_unit_nm;
          }
        },
        orderQty: {
          title: this.i18nService.getTranslation('SO_ORDERQTY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
        },
        free: {
          title: this.i18nService.getTranslation('SO_FREE'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,

        },
        assign: {
          title: this.i18nService.getTranslation('SO_ASSIGN'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: true,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
        },
        shortage: {
          title: this.i18nService.getTranslation('SO_SHORTAGE'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        available: {
          title: this.i18nService.getTranslation('SO_AVAILABLE'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        target: {
          title: this.i18nService.getTranslation('SO_TARGET'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        need: {
          title: this.i18nService.getTranslation('SO_NEED'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        price: {
          title: this.i18nService.getTranslation('SO_PRICE'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
        },
        orderAmount: {
          title: this.i18nService.getTranslation('SO_ORDER_AMOUNT'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
        },
        dueDateYmd: {
          title: this.i18nService.getTranslation('SO_DUEDATE'),
          type: 'html',
          class: 'center',
          defaultValue: this.dueDateCopy,
          filter: false,
          editable: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputDatetimeComponent },
          valuePrepareFunction: (value: any) => { return value }
        },
        unitCost: {
          title: this.i18nService.getTranslation('SO_UNIT_COST'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        itemCost: {
          title: this.i18nService.getTranslation('SO_ITEM_COST'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        utility: {
          title: this.i18nService.getTranslation('SO_UTILITY'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        totalCost: {
          title: this.i18nService.getTranslation('SO_TOTAL_COST'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
        },
        mpsYn: {
          title: 'MPS',
          type: 'html',
          class: 'center',
          filter: false,
          valuePrepareFunction: (value) => {
            let mps = value == 'true' ? 'Yes' : value == true ? 'Yes':'No';
            return mps;
          },
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: freeYn,
            },

          },
        },
        remark: {
          title: this.i18nService.getTranslation('SO_REMARK'),
          type: 'html',
          class: 'center',
          filter: false,
        },
      },
      pager: {
        display: true,
      },
      attr: {
        class: 'table table-bordered fixed_header process-path-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };
    setTimeout(function () {
      $('ng2-smart-table .process-path-table thead tr th.delYn:first').append('<label class="atman-checkbox"><input type="checkbox" class="all-item-checkbox" ></input><i></i></label>');
    }, 1000)
  }

  onDeletePathConfirm(event) {
    var self = this;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Path ?",
        content: "Are you want to delete this row?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          event.confirm.resolve(event.data);
          let deleteValue = event.data.salesOrderDetailCd;
          this.saleOrderCreateService.deleteSaleOrderTableEachRowCreate(deleteValue).then(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.message);
            } else {
              this.notification.showMessage("success", data.message);
              this.getDataTableDetail(this.detailInfo.salesOrderCd);
              this.detailInfo.BmSalesOrderDetail = [];
            }
          });
        }
      }
    );
  }
  onSaveConfirm(event) {
    let value = event.newData.salesOrderDetailCd;
    this.pathsSource.getAll().then((data) => {
      let index = _.findIndex(data, function (chr) {
        return chr.salesOrderDetailCd == value;
      });
      data[index] = event.newData;
      this.detailInfo.BmSalesOrderDetail = data;
    });

    setTimeout(() => {
      if (!this.permission.canSave) {
        this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
        return;
      }
      this.saleOrderCreateService.insertSaleOrderCreateTable(this.detailInfo.BmSalesOrderDetail).then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.getDataTableDetail(this.detailInfo.salesOrderCd);
        }
      })
    }, 400);
  }
  onCreatePathConfirm(event) {
    event.confirm.resolve(event.newData);
  }
  onSaveAll() {
    var shef = this;
    shef.pathsSource.getAll().then((data) => {
      if (this.checkInsertTable == true) {
        data = data.filter(p => (p.salesOrderDetailSeq == '' || p.salesOrderDetailSeq == 0))
      }
      let fixData = new SaleOrderCreateDetailModel();
      data.sort().reverse();
      let count = 0;
      data.forEach(item => {
        fixData.salesOrderCd = shef.detailInfo.salesOrderCd;
        fixData.companyId = shef.detailInfo.companyId;
        fixData.createdTime = new Date().toString('yyyy-MM-dd');
        fixData.changedTime = new Date().toString('yyyy-MM-dd');
        fixData.deliveryYmd = item.deliveryYmd;
        fixData.po = item.po;
        fixData.poNo = item.poNo;
        fixData.destination = item.destination;
        fixData.itemNm = item.itemNm;
        fixData.itemizedGenCd = item.itemizedGenCd;
        fixData.stockUnitGenCd = item.stockUnitGenCd;
        fixData.bizUnitId = item.bizUnitId;
        fixData.orderQty = parseInt(item.orderQty);
        fixData.price = parseInt(item.price);
        fixData.orderAmount = parseInt(item.orderAmount);
        fixData.dueDateYmd = item.dueDateYmd;
        fixData.mpsYn = item.mpsYn;
        fixData.remark = item.remark;
        shef.detailInfo.BmSalesOrderDetail.push(fixData);
        fixData = new SaleOrderCreateDetailModel();
      });

      setTimeout(() => {
        if (this.checkInsertTable == false) {
          this.saleOrderCreateService.insertSaleOrderCreateTable(this.detailInfo.BmSalesOrderDetail).then(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.message);
            } else {
              this.notification.showMessage("success", data.message);
              this.detailInfo.BmSalesOrderDetail = [];
              this.checkInsertTable = true;
              this.getDataTableDetail(this.detailInfo.salesOrderCd);
            }
          });
        } else {
          this.saleOrderCreateService.insertSaleOrderCreateTable(this.detailInfo.BmSalesOrderDetail).then(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.message);
            } else {
              this.notification.showMessage("success", data.message);
              this.detailInfo.BmSalesOrderDetail = [];
              this.getDataTableDetail(this.detailInfo.salesOrderCd);
            }
          });
        }
      }, 400);
    })
  }
  getDataTableDetail(saleOrderCreateID) {
    this.saleOrderCreateService.getAllListTableDetail().then(data => {
      this.detailTableToShow = data.filter(x => x.salesOrderCd == saleOrderCreateID);    
       this.onCopyFromData(this.detailTableToShow);
      for (var i = 0; i < this.detailTableToShow.length; i++) {
        let t = this.listDes.filter(x => x.value == this.detailTableToShow[i].destination);
        this.detailTableToShow[i].salesOrderDetailSeq = i + 1;
        this.pathsSource = new LocalDataSource(this.detailTableToShow);
      }
      this.initPathTable();
      return;
    });
  }
  insertGenName(lengthData: number) {
    for (var i = 0; i < lengthData; i++) {
      let t = this.listDes.filter(x => x.value == this.detailTableToShow[i].destination);
      this.pathsSource[i].no = i + 1;
    }
  }
  checkedValue() {
    var list = [];
    $('.single-checkbox').each(function () {
      if (this.checked) {
        var id = $(this).attr('attr-id');
        list.push(id);
      }
    });
    this.pathsSource.getAll().then((data) => {
      for (let index = 0; index < list.length; index++) {
        data[parseInt(list[index]) - 1].delYn = true;
      }
      this.detailInfo.BmSalesOrderDetail = data;
    });

    setTimeout(() => {
      if (!this.permission.canSave) {
        this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
        return;
      }
      this.saleOrderCreateService.insertSaleOrderCreateTable(this.detailInfo.BmSalesOrderDetail).then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.detailInfo.BmSalesOrderDetail = [];
          this.getDataTableDetail(this.detailInfo.salesOrderCd);
        }
      })
    }, 400);

  }
  SelectedAll() {
    var listAll = [];
    $('.all-item-checkbox').each(function () {
      if (this.checked) {
        listAll.push("1");
      }
    });
    if (listAll[0] == "1") {
      this.pathsSource.getAll().then((data) => {
        for (let index = 0; index < data.length; index++) {
          data[index].delYn = true;
        }
        this.detailInfo.BmSalesOrderDetail = data;
      });

      setTimeout(() => {
        if (!this.permission.canSave) {
          this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_CREATE_PERMISSION_DENIED'));
          return;
        }
        this.saleOrderCreateService.insertSaleOrderCreateTable(this.detailInfo.BmSalesOrderDetail).then(data => {
          if (data.error) {
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.pathsSource = new LocalDataSource();
            this.checkInsertTable = false;
            this.detailInfo.BmSalesOrderDetail = [];
          }
        })
      }, 400);
    }
    else {
      this.checkedValue();
    }
  }
  
   
  getDataPathsSource() {
    this.pathsSource.getAll().then((data) => {
      for (let index = 0; index < data.length; index++) {
        data[index].delYn = true;
      }
      console.log('Doi lai   trong select all dc ham data: ', data)
      this.detailInfo.BmSalesOrderDetail = data;
    });
  }

  initTestData() {

    this.currentIndex++;
    this.detailInfo =
      {
        salesOrderNm: `Name ${this.currentIndex}`,
        bizUnitId: "10007",
        cancelOrderYn: false,
        cancelReason: "10008",
        cancelYmd: "2019-11-02",
        changedTime: "11/26/2019 12:00:00 AM",
        changer: "",
        companyId: 1000,
        confirmedYmd: "2019-11-06",
        createdTime: "2019-11-26",
        creator: "atmaneuler",
        currencyGenCd: "10007",
        customerCd: "309000000000",
        delYn: false,
        deliveryYmd: "2019-11-26",
        description: "Chao dai ca",
        dueDateYmd: "2019-11-26",
        finalCost: 888,
        finalOrderAmount: 777,
        finalOverhead: 999,
        orderAmount: 111,
        paymentTermGenCd: "315000000001",
        receiveDateYmd: "2019-11-07",
        remark: "",
        salesOrderCd: "e4d43ae9-48e2-4d72-9b53-4d9c08765557",
        salesOrderNo: "SO191107-086",
        salesOrderSeq: 100086,
        stockUnitGenCd: "316000000001",
        taxAmount: 222,
        taxCodeGenCd: "10007",
        termGenCd: "317000000001",
        times: 1,
        totalAmount: 10000,
        useYn: true,
        BmSalesOrderDetail: []
      }
  }

}