import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from "@app/core/services/features.services/style-master.service";
import { Category } from '@app/core/common/static.enum';
import { BsModalService } from 'ngx-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomRenderSmartTableStyleInputComponent } from '../../common/input-editor.component';
import { CustomRenderSmartTableStyleInputCurrencyComponent } from '../../common/input-currency-editor.component';
import { CustomRenderSmartTableStyleInputCheckboxComponent } from '../../common/input-checkbox-editor.component';
import { CustomRenderSmartTableStyleSelect2Component } from '../../common/select2-editor.component';
import { BreakdownClickComponent } from './breakdown-click/breakdown-click.component';
import { CustomRenderSmartTableStyleInputDateComponent } from '../../common/input-date-editor.component';
import { CustomRenderSmartTableStyleInputFloatComponent } from '../../common/input-float-editor.component';
import { CommonFunction } from "@app/core/common/common-function";
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from "lodash";

@Component({
  selector: 'sa-po-material',
  templateUrl: './po-material.component.html',
  styleUrls: ['./po-material.component.css'],
  entryComponents: [
    CustomRenderSmartTableStyleInputComponent, CustomRenderSmartTableStyleInputCurrencyComponent, CustomRenderSmartTableStyleSelect2Component, CustomRenderSmartTableStyleInputDateComponent, CustomRenderSmartTableStyleInputCheckboxComponent, BreakdownClickComponent,
    CustomRenderSmartTableStyleInputFloatComponent
  ]
})
export class PoMaterialComponent extends BasePage implements OnInit {
  @Output() onRowMaterialClick = new EventEmitter();
  @Input() styleSysId: number = null;
  poSource: LocalDataSource = new LocalDataSource();
  data: any = [];
  destinations: any = [];
  poSettings: object = {
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
    select: true,
  };
  styleColors: any = [];
  materialList: any = [];
  contructions: any = [];
  colors: any = [];
  constructor(public userService: AuthService,
    public programService: ProgramService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    private styleMasterService: StyleMasterService,
    private _sanitizer: DomSanitizer
  ) {
    super(userService);
  }

  ngOnInit() {
    // this.checkPermission(ProgramList.Account_Master.valueOf())
    var self = this;
    self.data = [];
    // this.checkPermission(ProgramList.Account_Master.valueOf())
    self.loadAllData().then(function () {
      return self.loadPOList();
    }).then(function () {
      self.initTable();
    });
  }

  onReset(){
    this.poSource.load([]);
    this.data = [];
  }

  private initTable() {
    var self = this;
    self.poSettings = {
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
      select: true,
      columns: {
        useYn: {
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableStyleInputCheckboxComponent },
          valuePrepareFunction: (value, row) => {
            let cbkHtml = value ? '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox" attr-id="' + row.salesOrderDetailCd + '"  checked </input><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox"  attr-id="' + row.salesOrderDetailSeq + '" ></input><i></i></label>';
            return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          }
        },
        index: {
          title: this.i18nService.getTranslation('SEQ'),
          class: 'center',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction(value, row, cell) { return cell.row.index + 1; }
        },
        poNo: {
          title: this.i18nService.getTranslation('SOB_PO_NO'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        deliveryYmd: {
          title: this.i18nService.getTranslation('SO_DELIVERY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputDateComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        destinationGenCd: {
          title: this.i18nService.getTranslation('SO_DESTINATION'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleSelect2Component,
            config: {
              list: _.map(this.destinations, (r) => {
                return { id: r.gen_cd, text: r.gen_nm }
              }),
              destinations: this.destinations
            },
          },
          valuePrepareFunction: (value: any) => {
            var dest = _.find(this.destinations, function (d) {
              return d.gen_cd === value;
            });
            return (dest && dest.gen_nm) || '';
          }
        },
        poQty: {
          title: this.i18nService.getTranslation('ORDER_QTY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: BreakdownClickComponent,
            config: {
              styleSysId: this.styleSysId
            },
          },
          valuePrepareFunction: (cell, row) => { return row.poQty || '' }
        },
        lossRate: {
          title: this.i18nService.getTranslation('LOSS_PERSENT'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputCurrencyComponent,
          },
          valuePrepareFunction: (value: any) => { return value + '%' }
        },
        planQty: {
          title: this.i18nService.getTranslation('PLAN_QTY'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputCurrencyComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        price: {
          title: this.i18nService.getTranslation('PRICE'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputCurrencyComponent,
          },
          valuePrepareFunction: (value: any) => { 
            return value; 
          }
        },
        amount: {
          title: this.i18nService.getTranslation('AMOUNT'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputCurrencyComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        remark: {
          title:  this.i18nService.getTranslation('Remark'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header po-material-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    }

    setTimeout(function () {
      $('ng2-smart-table table.po-material-table thead .ng2-smart-titles').remove();
      $('ng2-smart-table table.po-material-table thead').prepend('<tr class="ng2-smart-titles-custom"><th colspan="2">SEQ</th><th>PO NO</th><th>Delivery</th><th>Destination</th><th>Order Qty</th><th>Loss %</th><th>Plan Qty</th><th>Price</th><th>Amount</th><th>Remark</th><th></th></tr>');
    }, 50);
    self.poSource.load(self.data || []);
    setTimeout(function(){
      if(!self.styleSysId){
        $('.po-material-table .ng2-smart-filters').hide();
      }else{
        $('.po-material-table .ng2-smart-filters').show();
      }
    },100)
  }

  onCreateConfirm(event) {
    var self = this;
    self.notification.showCenterLoading();
    var data = event.newData;
    data.useYn = true;
    data.id = CommonFunction.generateId();
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.poNo_valid) {
      self._notifyInValidField('poNo_0', false);
      invalid = true;
    }
    if (!valid.deliveryYmd_valid) {
      self._notifyInValidField('deliveryYmd_0', false);
      invalid = true;
    }
    if (!valid.destinationGenCd_valid) {
      self._notifyInValidField('destinationGenCd_0', false, 'select');
      invalid = true;
    }
    if (!valid.poQty_valid) {
      self._notifyInValidField('poQty_0', false);
      invalid = true;
    }
    if (!valid.lossRate_valid) {
      self._notifyInValidField('lossRate_0', false);
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('poNo_0', true);
    self._notifyInValidField('deliveryYmd_0', true);
    self._notifyInValidField('destinationGenCd_0', true, 'select');
    self._notifyInValidField('poQty_0', true);
    self._notifyInValidField('lossRate_0', true);
    var model = {
      styleSysId: self.styleSysId,
      poNo: data.poNo,
      deliveryYmd: data.deliveryYmd,
      destinationGenCd: data.destinationGenCd,
      poQty: Number(data.poQty),
      lossRate: Number(data.lossRate),
      planQty: Number(data.planQty),
      price: Number(data.price),
      amount: Number(data.amount),
      sizeGroupGenCd: data.sizeGroupGenCd
    }
    return self.styleMasterService.insertStyleMasterPO(model).then(function (rs) {
      self.notification.hideCenterLoading();
      if (rs && rs.success) {
        self.notification.showSuccess(rs.messages || 'Create successful.');
        data.poId = rs.data && rs.data.poId;
        if (data.pocsList && data.pocsList.length > 0) {
          var reqs = _.map(data.pocsList, function (po) {
            po.poId = data.poId;
            return self.styleMasterService.insertStyleMasterPOCS(po);
          });
          return Promise.all(reqs).then(function (rsPOCS) {
            event.confirm.resolve(data);
          });
        }else{
          event.confirm.resolve(data);
        }
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
    if (!valid.poNo_valid) {
      self._notifyInValidField('poNo', false);
      invalid = true;
    }
    if (!valid.deliveryYmd_valid) {
      self._notifyInValidField('deliveryYmd', false);
      invalid = true;
    }
    if (!valid.destinationGenCd_valid) {
      self._notifyInValidField('destinationGenCd', false, 'select');
      invalid = true;
    }
    if (!valid.poQty_valid) {
      self._notifyInValidField('poQty', false);
      invalid = true;
    }
    if (!valid.lossRate_valid) {
      self._notifyInValidField('lossRate', false);
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('poNo', true);
    self._notifyInValidField('deliveryYmd', true);
    self._notifyInValidField('destinationGenCd', true, 'select');
    self._notifyInValidField('poQty', true);
    self._notifyInValidField('lossRate', true);
    var model = {
      poId : data.poId,
      styleSysId: self.styleSysId,
      poNo: data.poNo,
      deliveryYmd: data.deliveryYmd,
      destinationGenCd: data.destinationGenCd,
      poQty: Number(data.poQty),
      lossRate: Number(data.lossRate),
      planQty: Number(data.planQty),
      price: Number(data.price),
      amount: Number(data.amount),
      sizeGroupGenCd: data.sizeGroupGenCd,
      companyId: data.companyId,
      useYn: data.useYn,
      remark: data.remark,
      creator: data.creator,
      createdTime: data.createdTime
    };
    return self.styleMasterService.updateStyleMasterPO(model).then(function (rs) {
      self.notification.hideCenterLoading();
      if (rs && rs.success) {
        self.notification.showSuccess(rs.messages || 'Create successful.');
        if (data.pocsList && data.pocsList.length > 0) {
          var reqs = _.map(data.pocsList, function (po) {
            if(po.poId === undefined){
              po.poId = data.poId;
              return self.styleMasterService.insertStyleMasterPOCS(po);
            }else{
              return self.styleMasterService.updateStyleMasterPOCS(po);
            }
          });
          return Promise.all(reqs).then(function (rsPOCS) {
            event.confirm.resolve(data);
          });
        }else{
          event.confirm.resolve(data);
        }
      } else {
        self.notification.showError(rs.messages || 'Create has error. Please try again later.')
      }
    });
  }

  onDeleteConfirm(event) {
    var self = this;
    var data = event.data;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orange Dark'></i> Delete PO ?",
        content: "Are you want to delete this po?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          self.notification.showCenterLoading();
          var reqs = _.map(data.pocsList, function (po) {
            return self.styleMasterService.deleteStyleMasterPOCS(po.poId, self.styleSysId, po.sizeId, po.colorId);
          });
          return Promise.all(reqs).then(function (rsPOCS) {
            return self.styleMasterService.deleteStyleMasterPO(data.poId).then(function (rs) {
              self.notification.hideCenterLoading();
              if (rs && rs.success) {
                self.notification.showSuccess(rs.messages || 'Delete successful.');
                event.confirm.resolve(data);
              } else {
                self.notification.showError(rs.messages || 'Delete has error. Please try again later.')
              }
            });
          });
         
        }
      }
    );
  }

  private checkValidTableInput(data) {
    var result = {
      poNo_valid: data.poNo.trim() !== '',
      // lossRate_valid: data.lossRate.trim() !== '',
      poQty_valid: (data.po_qty + '').trim() !== '',
      destinationGenCd_valid: (data.destinationGenCd + '').trim() !== '',
      deliveryYmd_valid: data.deliveryYmd.trim() !== '',
      lossRate_valid: data.lossRate >= 0 && data.lossRate < 10,
    };
    return result;
  }

  private _notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  private loadPOList() {
    var self = this;
    if (self.styleSysId) {
      return self.styleMasterService.getStyleMasterPOByStyle(self.styleSysId).then(function (rs) {
        if (rs.success) {
          self.data = _.map(rs.data, function (item, index) {
            item.index = index + 1;
            item.deliveryYmd = item.deliveryYmd ? moment(item.deliveryYmd).format('YYYY.MM.DD') : '';
            item.id = CommonFunction.generateId();
            return item;
          });
        }
      });
    }
  }

  private loadAllData() {
    return Promise.all([this.getDestination()]);
  }

  private getDestination() {
    return this.generalMasterService.listGeneralByCate(Category.Destination.valueOf()).then(data => this.destinations.push(...data));
  }

}


