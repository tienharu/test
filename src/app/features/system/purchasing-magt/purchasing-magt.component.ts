import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { ActivatedRoute } from '@angular/router';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { PurchasingMagtService } from '@app/core/services/purchasing-magt.service';
import { LocalDataSource } from 'ng2-smart-table/lib/data-source/local/local.data-source';
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PurchasingHeaderModel } from '@app/core/models/purchasing-header.model';
import { SearchPoModel } from '@app/core/models/purchasing-header.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';
import * as moment from 'moment';
import _ from 'lodash';


import { CustomPurchasingInputEditorComponent } from '../purchasing-magt/common/purchasing-input-editor.component';
import { CustomPurchasingSelectEditorComponent } from '../purchasing-magt/common/purchasing-select-editor.comonent';
import { CustomPurchasingInputCurrencyEditorComponent } from '../purchasing-magt/common/purchasing-input-currency-editor.component';

@Component({
  selector: 'sa-purchasing-magt',
  templateUrl: './purchasing-magt.component.html',
  styleUrls: ['../../../../assets/css/common_extra.css', '../../../../assets/css/smart-table.scss', "./purchasing-magt.component.css"],
  entryComponents: [
    CustomPurchasingInputEditorComponent, CustomPurchasingSelectEditorComponent, CustomPurchasingInputCurrencyEditorComponent
  ]
})
export class PurchasingMagtComponent extends BasePage implements OnInit {
  @ViewChild("popupPOSheetSearch") popupPOSheetSearch;
  _poSheetSearchModalRef: BsModalRef;

  isEdit: boolean = false;
  selectedPOSheet: any = null;
  selectedPuchNo: any = null;
  groupPurchOrderDetail: any = [];
  purchingData: any = [];
  suppliers: any[] = [];
  supplierData: any[] = [];

  options: any;
  purchasingHeaderInfo: PurchasingHeaderModel = new PurchasingHeaderModel();
  source: LocalDataSource = new LocalDataSource();
  modalRef: BsModalRef;
  totalAmount: number = 0;
  searchPoInfo: SearchPoModel = new SearchPoModel();
  valuePurchNo: any;
  @ViewChild("popupSearchPurchasingHeader") popupSearchPurchasingHeader;
  orderTypes: any = [{
    value: 0,
    text: 'Y'
  },
  {
    value: 1,
    text: 'Ing'
  },
  {
    value: 2,
    text: 'N'
  },
  {
    value: -1,
    text: 'ALL'
  }];
  settingsPurchasingComponent: any = {
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

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    rules: {
      purchYmd: {
        required: true
      },
      poSheetNo: {
        required: true
      },
      supplierCd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      purchYmd: {
        required: "",
      },
      poSheetNo: {
        required: "Please select"
      },
      supplierCd: {
        required: "Please select"
      }
    }
  };

  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private i18n: I18nService,
    private generalMasterService: GeneralMasterService,
    private traderService: TraderService,
    private styleMasterService: StyleMasterService,
    private workOrderMasterService: WorkOrderMasterService,
    private route: ActivatedRoute,
    private purchasingHearderService: PurchasingMagtService

  ) {
    super(userService);
  }



  ngOnInit() {
    // this.checkPermission(ProgramList.Purchasing_Magt.valueOf());
    this.purchasingHeaderInfo = new PurchasingHeaderModel();//this.purchasingHearderService.getModel();
    this.source = new LocalDataSource();
    this.show1();
    setTimeout(() => {
      this.initPurchasingComponentDatatable();
    }, 200);
    this.listSupplier().then(data => {
      this.supplierData.push(...data);
    });
  }

  private listSupplier() {
    return this.purchasingHearderService.listSuppliers();
  }

  show1() {
    $('#div1').css('display', 'block');
    $('#div2').css('display', 'none')
  }
  show2() {
    $('#div2').css('display', 'block');
    $('#div1').css('display', 'none')
  }

  private initPurchasingComponentDatatable() {
    this.settingsPurchasingComponent = {
      actions: {
        position: 'right',
        add: false,
        delete: false,
        columnTitle: ''
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
        itemizedGenNm: {
          title: this.i18n.getTranslation('ITEMIZED'),
          class: 'center',
          filter: false,
          type: 'html',
          editable: false,
          addable: false
        },
        materialDsplNm: {
          title: this.i18n.getTranslation('MARERIAL_NAME'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        materialCd: {
          title: this.i18n.getTranslation('CODE'),
          type: 'text',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        unit: {
          title: this.i18n.getTranslation('UNIT'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        colorName: {
          title: this.i18n.getTranslation('COLOR'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        poQty: {
          title: this.i18n.getTranslation('PO_QTY'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        price: {
          title: this.i18n.getTranslation('PRICE'),
          type: 'string',
          class: 'text-right',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value) => {
            return new Intl.NumberFormat('en-GB').format(value);
          }
        },
        amount: {
          title: this.i18n.getTranslation('AMOUNT'),
          type: 'string',
          class: 'text-right',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value) => {
            return new Intl.NumberFormat('en-GB').format(value);
          }
        },
        poUniqueNo: {
          title: this.i18n.getTranslation('PO_UNIQUE_NO'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        inedQty: {
          title: this.i18n.getTranslation('INED_QTY'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        inQty: {
          title: this.i18n.getTranslation('IN_QTY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomPurchasingInputCurrencyEditorComponent
          }
        },
        balQty: {
          title: this.i18n.getTranslation('BAL_QTY'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
        },
        purchLineStatus: {
          title: this.i18n.getTranslation('STATUS'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
          // editor: {
          //   type: 'list',
          //   config: {
          //     selectText: 'Select',
          //     list: this.orderTypes && this.orderTypes.map((grp) => {
          //       return { 'value': grp.value, 'text': grp.text, }
          //     })
          //   },
          // },
        },
        extraQty: {
          title: this.i18n.getTranslation('EXTRA_QTY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomPurchasingInputCurrencyEditorComponent
          }
        },
        actPrice: {
          title: this.i18n.getTranslation('PRICE'),
          type: 'html',
          class: 'text-right',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomPurchasingInputCurrencyEditorComponent
          },
          valuePrepareFunction: (value) => {
            return new Intl.NumberFormat('en-GB').format(value);
          }
        },
        purchAmount: {
          title: this.i18n.getTranslation('AMOUNT'),
          type: 'string',
          class: 'text-right',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value) => {
            return new Intl.NumberFormat('en-GB').format(value);
          }
        }
      },
      attr: {
        class: 'table table-bordered fixed_header bom-compoent-table'
      },
      pager: {
        display: false,
      },
    }
    this.source = new LocalDataSource();
    this.source.load([]);
  }

  // createConfirm(value) {
  //   var self = this;
  //   if (!value.newData.puchNo) {
  //     self.notifyInValidField('', false);
  //     return;
  //   }
  //   value.confirm.resolve(value.newData);
  // }

  onUpdateConfirm(event) {
    var self = this;
    var data = event.newData;
    if (data.inQty === "") {
      data.inQty = 0;
    }
    if (data.actPrice === "") {
      data.actPrice = 0;
    }
    if (data.extraQty === "") {
      data.extraQty = 0;
    }
    event.confirm.resolve(data);
    return this.source.getAll().then(function (data) {
      self.purchasingHeaderInfo.totalAmount = _.sumBy(data, "purchAmount");
    });
  }

  onDeleteConfirm(event) {
    var self = this;
    this.valuePurchNo = event.data.puchNo;
    if (event.data.puchNo == null || event.data.materialCd == 0) {
      self.source.remove(event.data);
    } else {
      if (!self.permission.canDelete) {
        self.notification.showMessage("error", self.i18n.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
        return;
      }
      self.notification.smartMessageBox(
        {
          title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Component?",
          content: "Are you want to delete this component?",
          buttons: "[No][Yes]"
        },
        ButtonPressed => {
          if (ButtonPressed == "Yes") {
            if (event.data.materialCd) {
              return self.purchasingHearderService.deletePurchasingDetail(event.data.puchNo, event.data.materialCd).then(function (rs) {
                if (rs.success) {
                  self.notification.showMessage("success", "Delete Purchasing successfully!");
                  self.source.remove(event.data);
                  // this.initPurchasingComponentDatatable();
                }
              });
            }
          }
        }
      )
    }
  }

  onDeletePurchasingHeader() {
    var self = this;
    if (self.isEdit) {
      return self.purchasingHearderService.deletePurchasingHeader(self.purchasingHeaderInfo.puchNo).then(data => {
        if (!data.success) {
          self.notification.showMessage("error", data.message);
        } else {
          self.notification.showMessage("success", data.message);
          self.onReset();
        }
      });
    }
  }

  onSubmit() {
    var self = this;
    self.notification.showCenterLoading();
    const _invalid = $("form.frm-detail").valid();
    if (!_invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    var model = _.clone(self.purchasingHeaderInfo);
    return self.source.getAll().then(function (data) {
      return data;
    }).then(function (details) {
      var req;
      if (!self.isEdit) {
        details = _.map(details, function (d) {
          return {
            materialCd: d.materialCd,
            itemizedGenCd: d.itemizedGenCd,
            colorId: d.colorId,
            inQty: d.inQty,
            actPrice: d.actPrice,
            purchAmount: d.purchAmount,
            styleNo: '',
            styleSysId: 0,
            poUniqueNo: d.poUniqueNo,
            purchLineStatus: d.purchLineStatus,
            extraQty: d.extraQty
          };
        });
        model.purchDetailList = details;
        req = self.purchasingHearderService.insertPurchasingHeader(model)
      } else {
        _.forEach(model.purchDetailList, function (item) {
          var existed = _.find(details, function (d) {
            return Number(d.materialCd) === Number(item.materialCd);
          });
          if (existed) {
            item.inQty += existed.inQty;
            item.actPrice = existed.actPrice;
            item.purchAmount = Number(item.actPrice) * Number(item.inQty || 0);
            item.purchLineStatus = existed.purchLineStatus;
            item.extraQty = existed.extraQty;
          }
        });
        model.totalAmount = _.sumBy(model.purchDetailList, "purchAmount");
        req = self.purchasingHearderService.updatePurchasingHeader(model);
      }
      return req.then(data => {
        self.notification.hideCenterLoading();
        if (!data.success) {
          self.notification.showMessage("error", data.message);
        } else {
          self.notification.showMessage("success", data.message);
          self.onSupplierChange(model.supplierCd);
        }
      });
    });

  }

  onShowPopupPurchasingHeader() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupSearchPurchasingHeader, config);
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  onReset() {
    $("form.frm-detail").validate().resetForm();
    this.purchasingHearderService.resetModel();
    this.purchasingHeaderInfo = new PurchasingHeaderModel();
    this.purchingData = [];
    this.suppliers = [];
    this.source.load([]);
    this._loadSelect2Data('selectSupplier', this.suppliers);
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  getPurchasingSelected(data) {
    // this.purchasingHeaderInfo.PurchDetailList = data;
    // var total = this.purchasingHeaderInfo.PurchDetailList;
    // for (let i = 0; i < total.length; i++) {
    //   this.totalAmount += total[i].amount
    // }
    // this.purchasingHeaderInfo.totalAmount = this.totalAmount;
    // this.purchasingHeaderInfo.PurchDetailList.forEach(element => {
    //   this.source.append(element);
    // });
  }

  //Vinh Leo
  selectPoSheet(data) {
    var self = this;
    self.selectedPOSheet = data;
    self.suppliers = [];
    self.purchasingHeaderInfo = new PurchasingHeaderModel();
    self.purchasingHeaderInfo.poSheetNo = data.poSheetNo || '';
    self.source.load([]);
    //self.purchasingHeaderInfo.PurchDetailList = data.purchOrderDetailList;
    // var total = self.purchasingHeaderInfo.PurchDetailList;
    // for (let i = 0; i < total.length; i++) {
    //   self.totalAmount += total[i].amount
    // }
    // self.purchasingHeaderInfo.totalAmount = self.totalAmount;
    if (data.purchOrderDetailList) {
      var groups = _.groupBy(data.purchOrderDetailList, 'customerCd');
      if (groups) {
        var keys = Object.keys(groups);
        self.suppliers = _.filter(self.supplierData, function (s) {
          return keys.indexOf(s.traderid + '') !== -1;
        });
        self._loadSelect2Data('selectSupplier', self.suppliers);
      }
      self.groupPurchOrderDetail = groups;
    }
  }

  onSupplierChange(value) {
    this.searchPoInfo.supplier = Number(value);
    this.searchPoInfo.poSheetNo = this.purchasingHeaderInfo.poSheetNo
    this.purchasingHearderService.listSearchPurchNo(this.searchPoInfo).then(rs => {
      this.purchingData = (rs && rs.result) || [];
      if (this.purchingData[0] && this.purchingData[0].puchNo) {
        this.selectedPuchNo = this.purchingData[0].puchNo;
      }else{
        this.selectedPuchNo = null;
      }
      return this.loadPurchasingData();
    });
  }

  showPoSheetSearchPopup() {
    this._poSheetSearchModalRef = this.modalService.show(this.popupPOSheetSearch, {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  closePoSheetSearchPopup() {
    this._poSheetSearchModalRef && this._poSheetSearchModalRef.hide();
  }

  private loadPurchasingData() {
    var self = this;
    if (self.selectedPuchNo) {
      return self.purchasingHearderService.getPurchasingById(self.selectedPuchNo).then(function (rs) {
        if (rs.success) {
          self.purchasingHeaderInfo = rs.data;
          self.purchasingHeaderInfo.purchYmd = moment(rs.data.purchYmd).format("YYYY.MM.DD");
          self.isEdit = true;
          self.purchingData = self.loadMorePurchDetailInfo(self.purchingData);
          self.source.load(self.purchingData);
        }
      });
    } else {
      self.purchasingHeaderInfo = new PurchasingHeaderModel();
      self.purchasingHeaderInfo.poSheetNo = self.selectedPOSheet.poSheetNo || '';
      self.purchasingHeaderInfo.supplierCd = Number(self.searchPoInfo.supplier);
      self.purchingData = self.loadMorePurchDetailInfo(self.purchingData);
      self.purchasingHeaderInfo.totalAmount = _.sumBy(self.purchingData, "purchAmount");
      self.source.load(self.purchingData);
      self.isEdit = false;
    }
  }

  private loadMorePurchDetailInfo(list) {
    var self = this;
    var purchDetailList = (self.purchasingHeaderInfo && self.purchasingHeaderInfo.purchDetailList) || [];
    _.forEach(list, function (item) {
      var purchDetail = _.find(purchDetailList, { "materialCd": Number(item.materialCd) });
      if (purchDetail) {
        // item.inQty = purchDetail.inQty;
        var inedQty = item.inedQty || 0;
        var inQty = item.inQty || 0;
        item.extraQty = purchDetail.extraQty;
        item.actPrice = purchDetail.actPrice;
        item.purchAmount = Number(item.actPrice) * Number(inQty || 0);
        item.balQty = item.poQty - (inedQty + inQty);
        if (item.balQty < 0) {
          item.inQty = item.poQty - item.inedQty;
          item.balQty = 0;
        }
        if (!item.inedQty && !item.inQty) {
          item.purchLineStatus = 'Not Yet';
        } else if (item.balQty > 0) {
          item.purchLineStatus = 'Ing';
        } else if (item.balQty <= 0) {
          item.purchLineStatus = 'Finished';
          item.inQty = inedQty;
          item.purchAmount = Number(item.actPrice) * Number(inedQty || 0);
        }
      } else {
        if (!item.inedQty && !item.inQty) {
          item.purchLineStatus = 'Not Yet';
        } else if (item.balQty > 0) {
          item.purchLineStatus = 'Ing';
        } else if (item.balQty <= 0) {
          item.purchLineStatus = 'Finished';
        }
        var inedQty = item.inedQty || 0;
        var inQty = item.inQty || 0;
        item.actPrice = item.price;
        item.purchAmount = Number(item.actPrice) * Number(inQty || 0);
        item.balQty = item.poQty - (inedQty + inQty);
        if (item.balQty < 0) {
          item.inQty = item.poQty - inedQty;
          item.balQty = 0;
        }

      }
    });
    return list;
  }

  private _loadSelect2Data(id, data) {
    var list = _.map(data, function (value) {
      return {
        id: value.traderid,
        text: value.traderlocalnm,
      }
    });
    var $select = $('#' + id);
    $select.select2({
      placeholder: "Select a supplier",
      ajax: {
        processResults: function (data) {
          return {
            results: list
          };
        }
      }
    });
  }
}

