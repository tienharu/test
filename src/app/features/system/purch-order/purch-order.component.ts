import { Component, OnInit, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, NotificationService } from '@app/core/services';
import { LocalDataSource } from "ng2-smart-table/lib/data-source/local/local.data-source";
import { CustomRenderSmartTableStyleSelect2PurchOrderComponent } from './common/select2-supplier-editor.component';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import _ from 'lodash';
import { CustomPurchInputEditorComponent } from './common/purch-input-editor.component';
import { CustomPurchTextareaEditorComponent } from './common/purch-textarea-editor.component';
import { PurchOrderDetailService } from '@app/core/services/features.services/purch-order-detail.service';
import { PurchOrderHeaderModel } from '@app/core/models/purch-order-header.model';
import { PurchOrderHeaderService } from '@app/core/services/features.services/purch-order-header.service';
import { CustomPurchInputDisabledEditorComponent } from './common/purch-input-disabled-editor.component';
import { ProgramList } from '@app/core/common/static.enum';
import { NewTraderModel } from '@app/core/models/new-trader.model';
import { CommonFunction } from '@app/core/common/common-function';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { MaterialMasterService } from '@app/core/services/features.services/material-master-service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'sa-purch-order',
  templateUrl: './purch-order.component.html',
  styleUrls: ['./purch-order.component.css'],
  entryComponents: [
    CustomRenderSmartTableStyleSelect2PurchOrderComponent,
    CustomPurchInputEditorComponent,
    CustomPurchTextareaEditorComponent,
    CustomPurchInputDisabledEditorComponent
  ]
})
export class PurchOrderComponent extends BasePage implements OnInit, AfterViewInit {
  changeAmount = new EventEmitter<any>();
  source: LocalDataSource = new LocalDataSource();
  modalRef: BsModalRef;
  totalAmount: number = 0;
  purchOrderHeader: PurchOrderHeaderModel;
  suppliers: NewTraderModel[] = [];
  itemizeds: any[] = [];
  materials: any[] = [];
  colors: any[] = [];
  settingsPurchOrderDetail: any = {
    actions: {
      position: 'right',
      add: true,
      columnTitle: ''
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
  }
  @ViewChild("popupWorkOrder") popupWorkOrder;
  @ViewChild("popupPurchOrder") popupPurchOrder;
  constructor(
    public userService: AuthService,
    public i18n: I18nService,
    private modalService: BsModalService,
    public programService: ProgramService,
    private notification: NotificationService,
    private purchOrderDetailSerice: PurchOrderDetailService,
    private purchOrderHeaderService: PurchOrderHeaderService,
    private generalMasterService: GeneralMasterService,
    private materialMasterService: MaterialMasterService,
    private styleMasterService: StyleMasterService,
    private i18nService:I18nService) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Purch_Order.valueOf());
    this.purchOrderHeader = this.purchOrderHeaderService.getModel();
    this.purchOrderHeader.creator = this.loggedUser.user_name;
    this.purchOrderHeader.companyId = this.loggedUser.company_id;
    this.purchOrderHeader.poSheetYmd = new Date().toString('yyyy-MM-dd');
    this.purchOrderHeader.createdTime = new Date().toString('yyyy-MM-dd');  
    return Promise.all([this.getSupplier()]).then(data => {
      this.suppliers.push(...data[0]);
      this.initPurhOrderDetailDatatable();
      this.setDataToTable();
      setTimeout(() => {
        $('ng2-smart-table table.purch-order-detail-table thead .ng2-smart-titles').css("display", "none");
        $('ng2-smart-table table.purch-order-detail-table thead').prepend('<tr class="ng2-smart-titles"><th>No</th><th>Material Name</th><th>Code</th><th>Itemized</th><th>Color</th><th>Plan Qty</th><th colspan="2">Work Order No</th><th>Style No</th><th>Supplier</th><th>Po Qty</th><th>Price</th><th>Amount</th><th>Bal Qty</th><th>Description</th><th></th></tr>');
      }, 100);
    });
  }

  ngAfterViewInit() {
    //Get All Itemized
    this.generalMasterService.listGeneralItemizedByMaterial().then(data => {
      this.itemizeds = data.map(item => Object.assign({}, {
        genName: item.gen_nm,
        genCd: item.gen_cd
      }));
    }); 
    //Get All Material
    this.materialMasterService.listMaterialMasterAll().then(data => {
      this.materials = data.map(item => Object.assign({}, {
        materialId: item.materialSeq,
        materialName: item.materialDsplNm
      }))
    });
    //Get All Color
    this.styleMasterService.getListStyleMasterColor().then(data => {
      this.colors = data.data.map(item => Object.assign({}, {
        colorId: item.colorId,
        colorName: item.colorName
      }));
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  private initPurhOrderDetailDatatable() {
    this.settingsPurchOrderDetail = {
      actions: {
        position: 'right',
        add: false,
        columnTitle: '',
        delete: false
      },
      hideSubHeader: true,
      // delete: {
      //   confirmDelete: true,
      //   deleteButtonContent: 'Delete',
      //   class: 'center',
      // },
      // add: {
      //   confirmCreate: true,
      //   addButtonContent: 'Add <i class="fa fa-plus"></i>',
      //   createButtonContent: 'Create',
      //   cancelButtonContent: 'Cancel',
      //   class: 'center',
      // },
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
        materialDsplNm: {
          title: this.i18n.getTranslation('MATERIAL_NAME'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false
        },
        materialCd: {
          title: this.i18n.getTranslation('CODE'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false
        },
        itemizedGenNm: {
          title: this.i18n.getTranslation('ITEMIZED'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false,
          // valuePrepareFunction: (cell, row) => {
          //   return row.itemizedGenNm
          // }
        },
        colorName: {
          title: this.i18n.getTranslation('COLOR'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false
        },
        poPlanQty: {
          title: this.i18n.getTranslation('PLAN_QTY'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => CommonFunction.FormatMoney(cell, 0)
        },
        totalWoNo: {
          title: this.i18n.getTranslation('TOTAL_WONO'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false
        },
        woNo: {
          title: this.i18n.getTranslation('WORK_ORDER_NO'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false
        },
        styleNo: {
          title: this.i18n.getTranslation('STYLE_NO'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false
        },
        customerCd: {
          title: this.i18n.getTranslation('SUPPLIER'),
          type: 'string',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleSelect2PurchOrderComponent,
            config: {
              list: _.map(this.suppliers, (p) => { return { id: p.traderid, text: p.traderlocalnm } })
            }
          },
          valuePrepareFunction: (cell, row) => {
            let cusId = parseInt(row.customerCd);
            if (cusId) {
              let customer = this.suppliers.find(x => x.traderid === cusId);
              return customer.traderlocalnm;
            } else {
              return '';
            }
          }
        },
        poQty: {
          title: this.i18n.getTranslation('PO_QTY'),
          filter: false,
          editable: false,
          type: 'html',
          editor: {
            type: 'custom',
            component: CustomPurchInputEditorComponent
          },
          valuePrepareFunction: (cell, row) => {
            if(cell !== null) {
              return CommonFunction.FormatMoney(cell, 0);
            }
          }
        },
        price: {
          title: this.i18n.getTranslation('PRICE'),
          type: 'html',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomPurchInputEditorComponent,
          }, 
          valuePrepareFunction: (cell, row) => {
            if(cell !== null) {
              return CommonFunction.FormatMoney(cell, 0);
            }
          }
        },
        amount: {
          title: this.i18n.getTranslation('AMOUNT'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            return (cell !== null && Number.isInteger(cell)) ? CommonFunction.FormatMoney(cell, 0) : cell;         
          }
        },
        balQty: {
          title: this.i18n.getTranslation('BALQTY'),
          type: 'string',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            if(cell !== null) {
              return CommonFunction.FormatMoney(cell, 0);
            }
          }
        },
        remark: {
          title: this.i18n.getTranslation('DESCRIPTION'),
          type: 'html',
          filter: false,
          editable: false,
          editor: {
            type: 'custom',
            component: CustomPurchTextareaEditorComponent
          }
        },
      },
      attr: {
        class: 'table table-bordered fixed_header purch-order-detail-table'
      },
      pager: {
        display: false,
      },
    }
    this.source = new LocalDataSource();
  }

  onUpdateConfirm(event) {
    let listCusCd = [];
    this.source.getAll().then(data => {
      // Get array customerCd from datasource
      listCusCd = data.map(i => i.customerCd).map(String);    
      // Check if old customerCd exist then remove customerCd from array 
      if (event.data.customerCd !== null && event.data.customerCd !== undefined && event.data.customerCd != 0) {
        listCusCd.splice( listCusCd.indexOf(event.data.customerCd.toString()), 1 );
      }
      // Remove customerCd = 0 or = null or duplicate
      listCusCd = listCusCd.reduce((list, item) => (list.includes(item) || item === '0' || item === 'null' || item === 'undefined') ? list : [...list, item], []);
      if (event.newData.customerCd !== null) {
        // Check if list customerCd contain new customerCd update then change totalSupplier
        if (!listCusCd.includes(event.newData.customerCd.toString())) {
          this.purchOrderHeader.totalSupplier = listCusCd.length + 1;
        } else {
          this.purchOrderHeader.totalSupplier = listCusCd.length
        }
        let oldAmount = event.data.amount;
        oldAmount = oldAmount ? parseInt(oldAmount.toString().replace(/\,/g,'')) : oldAmount;
        let newAmount = event.newData.amount;
        newAmount = newAmount ? parseInt(newAmount.replace(/\,/g,'')) : 0;
        // set Total Amount in header
        oldAmount ? this.totalAmount = this.totalAmount - oldAmount + newAmount : this.totalAmount += newAmount;
        // set value to 0 when blank
        if (!event.newData.amount) {
          event.newData.amount = 0;
        }
        if (!event.newData.poQty) {
          event.newData.poQty = 0;
          // set balQty when poQty = 0 or blank
          event.newData.balQty = event.newData.poPlanQty;
        }
        if (!event.newData.price) {
          event.newData.price = 0;
        }
      } else {
        this.purchOrderHeader.totalSupplier = listCusCd.length
        if (event.data.customerCd !== null && event.data.customerCd !== undefined) {
          event.newData.price = null;
          event.newData.poQty = null;
          event.newData.amount = null;
          event.newData.balQty = null;
          event.newData.remark = null;
        }
      }
      event.confirm.resolve(event.newData);
    })
  }

  onDeleteConfirm(event) {
  }

  onSubmit() {
    if(!this.purchOrderHeader.totalWoNo) {
      this.notification.showError("Please Select Work Order!")
      return;
    }
    let poDetails = [];
    let objectParam = {};
    // Clone data from table to new object
    this.source.getAll().then(data => {
      poDetails = data.map(poDetail => poDetail)
      poDetails.forEach(podtl => {
        podtl.poNoStatus = 'N';
        podtl.poSheetNoStatus = 'N';
        podtl.amount = podtl.amount ? parseInt(podtl.amount.toString().replace(/\,/g,'')) : 0;
        podtl.poQty = podtl.poQty ? podtl.poQty : 0;
        podtl.price = podtl.price ? podtl.price : 0;
        podtl.balQty = podtl.balQty ? podtl.balQty : 0;
      });
      objectParam = {
        PurchHeader: this.purchOrderHeader,
        PurchOrderDetail: poDetails,
      };
      //INSERT Purch Order
      this.purchOrderHeader.totalAmount = this.totalAmount;
      if (!this.purchOrderHeader.poSheetNo) {
        this.purchOrderHeader.poSheetYmd = new Date().toString('yyyy-MM-dd');
        this.purchOrderHeader.createdTime = new Date().toString('yyyy-MM-dd');
        this.purchOrderHeaderService.insertPurchOrder(objectParam).then(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.message);
          } else {
            this.notification.showMessage("success",data.message );
            this.purchOrderHeader.poSheetNo = data.data.poSheetNo;
          }
        });
      } else {
        //UPDATE Purch Order
        this.purchOrderHeaderService.updatePurchOrder(objectParam).then(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.message);
          } else {
            this.notification.showMessage("success",data.message );
          }
        })
      }
    });    
  }

  onReset() {
    this.purchOrderHeader = new PurchOrderHeaderModel();
    this.purchOrderHeader.creator = this.loggedUser.user_name;
    this.purchOrderHeader.companyId = this.loggedUser.company_id;
    this.purchOrderHeader.poSheetYmd = new Date().toString('yyyy-MM-dd');
    this.purchOrderHeader.creator = this.loggedUser.user_name;
    this.purchOrderHeader.createdTime = new Date().toString('yyyy-MM-dd');
    this.totalAmount = 0;
    this.source = new LocalDataSource();
  }

  onDeletePo() {
    if(!this.permission.canDelete){
      this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
      return;
    }
    this.notification.confirmDialog(
      "Delete Purch Order Confirmation!",
      `Are you sure to delete ${this.purchOrderHeader.poSheetNo}?`,
      x => {
        if (x) {
          this.purchOrderHeaderService.deletePurchOrder(this.purchOrderHeader.poSheetNo).then(data => {
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

  onShowPopupWorkOrder() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupWorkOrder, config);
  }

  onShowPopupPurchOrder() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupPurchOrder, config);
  }

  onSelectRow(Row) {
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  //get work order no from popup and add to table detail
  getWorkOrderNoSelected(data) {
    this.source = new LocalDataSource();
    this.purchOrderHeader.totalWoNo = data.length;
    this.purchOrderHeaderService.getSelectedWorkOrder(data.join(',')).then(rs => {
      let purchOrderDetailFixed = rs.reduce((groups, item) => {
        //Find index that item has same 'materialCd' and 'colorId'
        let indx = groups.findIndex(element => element.materialCd === item.materialCd && element.colorName === item.colorName);
        if(indx < 0){
          //If not found, add new object to return function
          let fixedItem = item;
          fixedItem.totalWoNo = 1;
          fixedItem.wonoList = [{
            woNo: fixedItem.woNo,
            woSeq: fixedItem.woSeq,
            styleNo: fixedItem.styleNo,
            styleSysId: fixedItem.styleSysId
          }]
          fixedItem.woNo = fixedItem.woNo.toString();
          fixedItem.poQty = null;
          fixedItem.price = null;
          fixedItem.amount = null;
          fixedItem.balQty = null;
          fixedItem.remark = '';
          groups.push(fixedItem);
        } else {
          //If found, recalculation value of object that has same 'materialCd' and 'colorId' 
          groups[indx].woNo = groups[indx].woNo + ',' + item.woNo.toString();
          groups[indx].styleNo = groups[indx].styleNo + ',' + item.styleNo.toString();
          groups[indx].totalWoNo++;
          if(groups[indx].wonoList) {
            groups[indx].wonoList.push({
              woNo: item.woNo,
              woSeq: item.woSeq,
              styleNo: item.styleNo,
              styleSysId: item.styleSysId
            })
          }
        }
        return groups;
      }, []);
      this.purchOrderHeader.totalMaterials = purchOrderDetailFixed.length;
      purchOrderDetailFixed.forEach(element => {
        this.source.append(element);
      });
    });
  }

  getPurchOrderSelected(event) {
    this.purchOrderHeader = event;
    this.purchOrderHeader.poSheetYmd = CommonFunction.formatDate(this.purchOrderHeader.poSheetYmd);
    this.totalAmount = this.purchOrderHeader.totalAmount;
    this.getPoDetailByPoSheetNo(this.purchOrderHeader.poSheetNo).then(data => {
      this.source = new LocalDataSource();
      data.purchOrderDetailList.forEach(element => {
        if (!element.customerCd) {
          element.amount = null;
          element.poQty = null;
          element.price = null;
          element.balQty = null;
        } else {
          element.poQty = element.poQty != 0 ? element.poQty : 0;
          element.price = element.price != 0 ? element.price : 0;
          element.amount = element.amount != 0 ? CommonFunction.FormatMoney(element.amount) : 0;
          element.balQty = element.poPlanQty - element.poQty;
        }
        // element.amount = element.amount != 0 ? CommonFunction.FormatMoney(element.amount) : null;
        // element.poQty = element.poQty != 0 ? element.poQty : null;
        // element.price = element.price != 0 ? element.price : null;
        
        element.woNo = element.wonoList.reduce((calcWoNoResult, item) => {
          calcWoNoResult = calcWoNoResult ? calcWoNoResult + ', ' + item.woNo.toString() : item.woNo.toString();
          return calcWoNoResult;
        }, '');
        element.styleNo = element.wonoList.reduce((calcWoNoResult, item) => {
          calcWoNoResult = calcWoNoResult ? calcWoNoResult + ', ' + item.styleNo : item.styleNo;
          return calcWoNoResult;
        }, '');
        element.materialDsplNm = this.materials.find(x => x.materialId === element.materialCd).materialName;
        element.colorName = this.colors.find(x => x.colorId === element.colorId).colorName;
        element.itemizedGenNm = this.itemizeds.find(x => x.genCd === element.itemizedGenCd).genName;
        this.source.append(element);
      });
    });
    
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  private getPoDetailByPoSheetNo(poSheetNo: number) {
    return this.purchOrderDetailSerice.getPurchOrderDetailByPoSheetNo(poSheetNo);
  }

  private setDataToTable() {
    this.purchOrderHeader.purchOrderDetails.forEach(element => {
      element.woNos = element.purchOrderWonos.map(poWoNo => poWoNo.woNo.toString()).join(', ');     
      element.styleNos = element.purchOrderWonos.map(poStyleNo => poStyleNo.styleNo).join(', ')             
      this.source.append(element);
    });
  }

  private getSupplier() {
    return this.purchOrderHeaderService.getCustomer();
  }
}
