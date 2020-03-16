import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';
import * as moment from 'moment';
import _ from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { InboundStyleService } from '@app/core/services/inbound-style.service';
import { InboundStyleHeaderModel } from '@app/core/models/inbound-style-header.model';
import { CustomInboundStyleTextareaEditorComponent } from './common/inbound-style-textarea-editor.component';
import { CustomInboundStyleDisabledEditorComponent } from './common/inbound-style-input-disabled-editor.component';
import { CustomInboundStyleEditorComponent } from './common/inbound-style-input-editor.component';
import { CustomRenderSmartTableSelect2InboundStyleComponent } from './common/select2-inbound-style-editor.component';
import { SearchWorkOrderModel } from '@app/core/models/work-order-master-model';

@Component({
  selector: 'sa-inbount-style',
  templateUrl: './inbount-style.component.html',
  styleUrls: ['../../../../assets/css/common_extra.css', '../../../../assets/css/smart-table.scss', "./inbount-style.component.css"],
  entryComponents: [ CustomInboundStyleTextareaEditorComponent,
    CustomInboundStyleDisabledEditorComponent,
    CustomInboundStyleEditorComponent,
    CustomRenderSmartTableSelect2InboundStyleComponent]
})
export class InbountStyleComponent extends BasePage implements OnInit {
  userLogin: any;
  isEdit: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  inboundStyleHeaderModel: InboundStyleHeaderModel;
  locations: GeneralMasterModel[] = [];
  processes: GeneralMasterModel[] = [];
  _searchWorkOrderNoModalRef: BsModalRef;
  _searchInboundStyleHeaderModalRef: BsModalRef;
  suppliers: any = [];
  sampSteps: any = [];
  traderList: any = [];
  listWoMaterialHeader : any;
  listWOMaterial : any = [];
  orderType : any;
  styleName :  any;
  buyerName : any;
  stepSeq : number;
  colors: any = [];
  sizes: any = [];
  btnSubmitDisabled: boolean = false;

  @ViewChild("popupSearchWorkOrderNo") popupSearchWorkOrderNo;
  @ViewChild("popupSearchInboundStyleHeader") popupSearchInboundStyleHeader;

  modelConfig: any = {
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };

  entryData = {
    date: '',
    user: ''
  };
  listDueOutTypt = [
    { name: "To Factory", value: 1 },
    { name: "Oursourcing(Enable Price)", value: 2 }
  ];
  orderTypes: any = [
    {
      value: 1,
      text: 'Main'
    },
    {
      value: 0,
      text: 'Sample'
    }
  ];
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private i18n: I18nService,
    private generalMasterService: GeneralMasterService,
    private traderService: TraderService,
    private styleMasterService: StyleMasterService,
    private workOrderMasterService: WorkOrderMasterService,
    private inboundStyleService: InboundStyleService
  ) {
    super(userService);
    this.entryData.date = moment().format('YYYY.MM.DD');
    this.entryData.user = this.loggedUser.user_name;
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    rules: {
      styleNo: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      styleNo: {
        required: 'Please select'
      },
    }
  };
  settingsInboundStyleComponent: any = {
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
  private initApprovalComponentDatatable() {
    this.settingsInboundStyleComponent = {
      actions: {
        position: 'right',
        add: true,
        columnTitle: ''
      },
      // hideSubHeader: !isEdit,
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
          title: 'No',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value, row, cell) => {
            return cell.row.index + 1;
          }
        },
        colorId: {
          title: this.i18n.getTranslation('COLOR'),
          type: 'string',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableSelect2InboundStyleComponent
          },
          valuePrepareFunction: (cell, row) => {
            let colorId = parseInt(row.colorId);
            if (colorId) {
              let color = this.colors.find(x => x.id === colorId);
              return color.text;
            } else {
              return '';
            }
          }
        },
        sizeId: {
          title: this.i18n.getTranslation('SIZE'),
          type: 'string',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableSelect2InboundStyleComponent
          }
        },
        woOrder: {
          title: this.i18n.getTranslation('WO_ORDER'),
          type: 'string',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleDisabledEditorComponent
          },
          valuePrepareFunction: (cell, row) => typeof cell == 'number' ? CommonFunction.FormatMoney(cell) : cell
        },
        recevied: {
          title: this.i18n.getTranslation('RECEVIED'),
          type: 'string',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleDisabledEditorComponent
          },
          valuePrepareFunction: (cell, row) => typeof cell == 'number' ? CommonFunction.FormatMoney(cell) : cell
        },
        inQty: {
          title: this.i18n.getTranslation('RECEIPT'),
          type: 'string',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleEditorComponent
          },
          valuePrepareFunction: (cell, row) => typeof cell == 'number' ? CommonFunction.FormatMoney(cell) : cell
        },
        remain: {
          title: this.i18n.getTranslation('REMAIN'),
          type: 'string',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleDisabledEditorComponent
          },
          valuePrepareFunction: (cell, row) => typeof cell == 'number' ? CommonFunction.FormatMoney(cell) : cell
        },
        price: {
          title: this.i18n.getTranslation('PRICE'),
          type: 'string',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleDisabledEditorComponent
          },
          valuePrepareFunction: (cell, row) => typeof cell == 'number' ? CommonFunction.FormatMoney(cell) : cell
        },
        amount: {
          title: this.i18n.getTranslation('AMOUNT'),
          type: 'string',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleDisabledEditorComponent
          },
          valuePrepareFunction: (cell, row) => typeof cell == 'number' ? CommonFunction.FormatMoney(cell) : cell
        },
        remark: {
          title: this.i18n.getTranslation('DESCRIPTION'),
          type: 'html',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomInboundStyleTextareaEditorComponent
          }
        },
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header process-path-route-table'
      },
    }
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Inbound_Style.valueOf());
    this.inboundStyleHeaderModel = this.inboundStyleService.getModel();
    this.inboundStyleHeaderModel.creator = this.loggedUser.user_name;
    this.inboundStyleHeaderModel.inboundYmd = new Date().toString('yyyy-MM-dd');
    this.initApprovalComponentDatatable();
    this.getSampStepList().then(rs => this.sampSteps.push(...rs));
    this.getLocationList().then(rs => this.locations.push(...rs));
    this.getProcessList().then(rs => this.processes.push(...rs.filter(item => item.ck_value_1 === '8')));
    this.getAllTrader().then(rs => this.traderList.push(...rs));
    this.getSupplier().then(rs => this.suppliers.push(...rs));
    setTimeout(() => {
      $('ng2-smart-table table.process-path-route-table thead .ng2-smart-titles').css("display", "none");
      $('ng2-smart-table table.process-path-route-table thead').prepend('<tr class="ng2-smart-titles row-head-2"> '
        +'<th>Color</th><th>Size</th><th>WO Order</th><th>Received</th><th>Receipt</th><th>Remain</th><th>Price</th><th>Amount</th></tr>');
      $('ng2-smart-table table.process-path-route-table thead').prepend('<tr class="ng2-smart-titles row-head-1">'
        +'<th rowspan="2">No</th><th colspan="2">Order</th><th colspan="4">Quantity</th><th colspan="2">Sales Amount</th><th rowspan="2">Description</th><th rowspan="2"></th></tr>');
    }, 100);

  }

  createConfirm(event) {
    if (!this.inboundStyleHeaderModel.woNo) {
      this.notification.showError("Please select Work Order before insert to table!");
      return;
    } 
    if (!event.newData.colorId) {
      this.notification.showError("Please select Color!");
      return;
    } else if (!event.newData.sizeId) {
      this.notification.showError("Please select Size!");
      return;
    }
    event.newData.price = this.inboundStyleHeaderModel.price;
    event.newData.amount = (<HTMLInputElement>document.getElementById('amount-1')).value;
    this.source.getAll().then(data => {
      if (data.length > 0) {
        this.inboundStyleHeaderModel.inboundQty = data.reduce((prev, curr) => prev + curr.inQty, 0) + event.newData.inQty;
        this.inboundStyleHeaderModel.amount = data.reduce((prev, curr) => prev + parseInt(CommonFunction.removeComma(curr.amount)), 0) + parseInt(CommonFunction.removeComma(event.newData.amount));
      } else {
        this.inboundStyleHeaderModel.inboundQty = event.newData.inQty;
        this.inboundStyleHeaderModel.amount = parseInt(CommonFunction.removeComma(event.newData.amount));
      }
    });
    event.confirm.resolve(event.newData);
  }

  updateConfirm(event) {
    event.confirm.resolve(event.newData);
  }

  deleteConfirm(event) {
    this.source.remove(event.data);
    this.source.getAll().then(data => {
      this.inboundStyleHeaderModel.inboundQty = data.reduce((prev, curr) => prev + curr.inQty, 0);
      this.inboundStyleHeaderModel.amount = data.reduce((prev, curr) => prev + parseInt(CommonFunction.removeComma(curr.amount)), 0)
    });
  }

  showSearchWorkOrderNoPopup() {
    this._searchWorkOrderNoModalRef = this.modalService.show(this.popupSearchWorkOrderNo, this.modelConfig);
  }

  showSearchInboundStyleHeaderPopup() {
    this._searchInboundStyleHeaderModalRef = this.modalService.show(this.popupSearchInboundStyleHeader, this.modelConfig);
  }

  getWorkOrderNoSelected(event) {
    this.initApprovalComponentDatatable();
    // ============= Get Style Master to get Color Name ============= //
    this.styleMasterService.getStyleMasterColorByStyle(event.styleSysId).then(data => {
      this.handleSyleColorResult(data);
    });
    // ============= Get WO CS to get Size and PlanQty============= //
    this.workOrderMasterService.getWorkOrderCSById(event.woNo, event.stepSeq).then(data => {
      this.handleWoCsDataResult(data);      
    });
    this.inboundStyleService.searchInboundStyleDetailByWonoSteqSeq(event.woNo, event.stepSeq).then(data => {
      let dataWithReceived = data.reduce((prev, curr) => {
        const obj = prev.find(x => x.colorId === curr.colorId && x.sizeId === curr.sizeId);
        if (!obj) {
          curr.recevied = curr.inQty;
          curr.inQty = 0;
          prev.push(curr);
        } else {
          obj.recevied += curr.inQty;
        }
        return prev;
      }, []); 
      this.inboundStyleService.setReceivedData(dataWithReceived);
    })
    event.price = this.inboundStyleHeaderModel.price;
    event.remark = this.inboundStyleHeaderModel.remark;

    this.inboundStyleHeaderModel = event;
    this.inboundStyleService.setModel(this.inboundStyleHeaderModel);
    this.inboundStyleHeaderModel.creator = this.loggedUser.user_name;
    this.inboundStyleHeaderModel.inboundYmd = new Date().toString('yyyy-MM-dd');
    this.inboundStyleHeaderModel.buyerCd = event.buyer;
    this.orderType = event.orderType ? 'Main' : 'Sample';
    this.styleName = event.styleNo;
    this.buyerName = this.traderList.find(p =>p.trader_id === event.buyer).trader_local_nm;
    this.inboundStyleService.setStyleSysId = event.styleSysId;
  }
  
  getInboundStyleHeaderSelected(event) {
    this.notification.showCenterLoading();
    this.inboundStyleHeaderModel = event;
    this.inboundStyleHeaderModel.inboundYmd = CommonFunction.formatDate(event.inboundYmd);
    let woSearchModel = new SearchWorkOrderModel();
    woSearchModel.woNo = event.woNo;
    Promise.all([
      // Get data from Inbound Style Detail
      this.inboundStyleService.searchInboundStyleDetailByWonoSteqSeq(event.woNo, event.stepSeq),
      // Get data from Work Order CS to setting PlanQty
      this.workOrderMasterService.getWorkOrderCSById(event.woNo, event.stepSeq),
      // Get data from Work Order Header to setting orderType, stypeName, buyer
      this.workOrderMasterService.search(woSearchModel)
    ]).then(adata => {
      let inboundDetails = adata[0].reverse()
      // Handle list Inbound detail when had 'inboundStyleNo'
      //    +   Tính tổng 'received' tính từ detail của inbound được chọn trở về trước
      //    +   Tính 'remain', 'amount' của inbound được chọn
      let listObjectDetailFixed = inboundDetails.reduce((prev, curr) => {
        const objectFound = prev.find(x => x.colorId === curr.colorId && x.sizeId === curr.sizeId);
        if (!objectFound) {
          curr.checkpoint = curr.styleInboundNo !== event.styleInboundNo;
          curr.recevied = 0;
          curr.woOrder = adata[1].find(x => x.colorId === curr.colorId && x.sizeId === curr.sizeId).planQty;
          curr.remain = 0;
          curr.price = event.price;
          curr.amount = 0;
          prev.push(curr);
          return prev;
        } else {
          if (!objectFound.checkpoint) {
            return prev;
          }
          if (event.styleInboundNo === curr.styleInboundNo) {
            objectFound.styleInboundNo = curr.styleInboundNo;
            objectFound.recevied += objectFound.inQty;
            objectFound.inQty = curr.inQty;
            objectFound.remark = curr.remark;
            objectFound.checkpoint = false;
            objectFound.remain = objectFound.woOrder - objectFound.recevied - objectFound.inQty;
            objectFound.amount = event.price * curr.inQty;
            objectFound.inboundSeq = curr.inboundSeq;
            return prev;
          }
          objectFound.recevied += objectFound.inQty;
          objectFound.inQty = curr.inQty;
          return prev;
        }
      }, []);
      this.handleWoCsDataResult(adata[1]);
      const woModel = adata[2].find(x => x.stepSeq === event.stepSeq) || {};
      this.inboundStyleService.setStyleSysId = woModel.styleSysId;
      // Get data from Style Color to setting ColorName
      this.styleMasterService.getStyleMasterColorByStyle(woModel.styleSysId).then(data => {
        this.handleSyleColorResult(data);
      });
      this.orderType = woModel.orderType ? 'Main' : 'Sample';
      this.styleName = woModel.styleNo;
      this.buyerName = this.traderList.find(p =>p.trader_id === woModel.buyer).trader_local_nm;
      listObjectDetailFixed.sort(CommonFunction.compareValues('inboundSeq'));
      this.inboundStyleService.setReceivedData(listObjectDetailFixed);
      this.source.load(listObjectDetailFixed);
      this.notification.hideCenterLoading();
    })
  }

  closeSearchWorkOrderNoPopup() {
    this._searchWorkOrderNoModalRef && this._searchWorkOrderNoModalRef.hide();
  }

  closeSearchInboundStyleHeaderPopup() {
    this._searchInboundStyleHeaderModalRef && this._searchInboundStyleHeaderModalRef.hide();
  }
  
  onSubmit() {
    if(!this.inboundStyleHeaderModel.woNo) {
      this.notification.showError("Please Select Work Order!")
      return;
    }
    this.notification.showCenterLoading();
    this.btnSubmitDisabled = true;
    const _invalid = $("form.frm-due-out-material-detail").valid();
    if (!_invalid) {
      this.notification.hideCenterLoading();
      return;
    }
    this.source.getAll().then(data => {
      this.inboundStyleHeaderModel.details = data;
      // INSERT DATA
      if (!this.inboundStyleHeaderModel.styleInboundNo) {
        this.inboundStyleService.insertInboundStyle(this.inboundStyleHeaderModel).then(data => {
          if (!data.success) {
            this.notification.hideCenterLoading();
            this.notification.showMessage('error', data.message);
            this.btnSubmitDisabled = false;
          } else {
            this.notification.hideCenterLoading();
            this.notification.showMessage('success', data.message);
            this.btnSubmitDisabled = false;
            this.inboundStyleHeaderModel.styleInboundNo = data.data.styleInboundNo;
          }
        });
      } 
      // UPDATE DATA
      else {
        this.inboundStyleService.updateInboundStyle(this.inboundStyleHeaderModel).then(data => {
          if (!data.success) {
            this.notification.hideCenterLoading();
            this.notification.showMessage('error', data.message);
            this.btnSubmitDisabled = false;
          } else {
            this.notification.hideCenterLoading();
            this.notification.showMessage('success', data.message);
            this.btnSubmitDisabled = false;
          }
        });
      }
    });
  }

  onReset() {
    this.notification.hideCenterLoading();
    $("form.frm-due-out-material-detail").validate().resetForm();
    this.inboundStyleHeaderModel = new InboundStyleHeaderModel();
    this.inboundStyleHeaderModel.creator = this.loggedUser.user_name;
    this.inboundStyleHeaderModel.companyId = this.loggedUser.company_id;
    this.inboundStyleHeaderModel.inboundYmd = new Date().toString('yyyy-MM-dd');
    this.inboundStyleHeaderModel.creator = this.loggedUser.user_name;
    this.inboundStyleHeaderModel.createdTime = new Date().toString('yyyy-MM-dd');
    this.orderType = null;
    this.styleName = null;
    this.buyerName = null;
    this.source = new LocalDataSource();
  }

  onDelete() {
    if(!this.permission.canDelete){
      this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
      return;
    }
    this.notification.confirmDialog(
      "Delete Purch Order Confirmation!",
      `Are you sure to delete ${this.inboundStyleHeaderModel.styleInboundNo}?`,
      x => {
        if (x) {
          let styleSysId = this.inboundStyleService.getStyleSysId();
          this.inboundStyleService.deleteInboundStyle(this.inboundStyleHeaderModel.styleInboundNo, styleSysId).then(data => {
            if (!data.success) {
              this.notification.showMessage("error", data.message);
            } else {
              this.notification.showMessage("success", data.message);
              this.onReset();
            }
          })
        }
      }
    );
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  private getLocationList() {
    return this.generalMasterService.listGeneralByCate(Category.Location.valueOf());
  }
  private getProcessList() {
    return this.generalMasterService.listGeneralByCate(Category.Process.valueOf());
  }
  private getAllTrader() {
    return this.traderService.ListTrader(this.companyInfo.company_id);
  }
  private getSampStepList() {
    return this.generalMasterService.listGeneralByCate(Category.SampleStep.valueOf());
  }
  private getSupplier() {
    return this.inboundStyleService.getCustomer();
  }
 
  onChangePrice(event) {
    let priceElement = (<HTMLInputElement>document.getElementById('price-1'));
    let amountElement = (<HTMLInputElement>document.getElementById('amount-1'));
    let receiptElement = (<HTMLInputElement>document.getElementById('inQty-1'));
    if (priceElement) {
      priceElement.value = CommonFunction.FormatMoney(event);
      amountElement.value = CommonFunction.FormatMoney(event * parseInt(CommonFunction.removeComma(receiptElement.value)));
    }
    this.source.getAll().then(data => {
      data.forEach((element) => {
        element.price = event;
        element.amount = CommonFunction.FormatMoney(event * element.inQty);
        this.source.update(element, '');
      }); 
    })
  }

  private handleWoCsDataResult(data: any) {
    // Merge data
    if (data.length > 0) {
      this.workOrderMasterService.storeWorkOrderCSModel(data);
      this.sizes = _.uniqBy(data.map(item => { return { sizeId: item.sizeId } }), 'sizeId').sort();
      this.inboundStyleService.setSize(this.sizes);
    } 
  }

  private handleSyleColorResult(data: any) {
    // Merge data
    if (data.success) {
      this.colors = data.data.map(item => {
        return {
          id: item.colorId,
          text: item.colorName
        }
      })
    }
    this.inboundStyleService.setColor(this.colors);
  }
}