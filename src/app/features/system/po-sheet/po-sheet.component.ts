import { Component, OnInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService, SystemMenuService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import _ from 'lodash';
import { BasePage } from '@app/core/common/base-page';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { PurchOrderDetailModel } from '@app/core/models/purch-order-detail.model';
import { PurchOrderHeaderModel } from '@app/core/models/purch-order-header.model';

import { PoSheetService } from '@app/core/services/features.services/po-sheet.service';
import { min } from 'rxjs/operators';
import { ContactorLessModel } from '@app/core/models/crm/expenses-magt.model';
@Component({
  selector: 'sa-po-sheet',
  templateUrl: './po-sheet.component.html',
  styleUrls: ['./po-sheet.component.css']
})
export class PoSheetComponent extends BasePage implements OnInit {
  @ViewChild("popupPOSheet") popupPOSheet;
  _poSheetModalRef: BsModalRef;
  purchDetail: PurchOrderDetailModel;
  poDetail: PurchOrderDetailModel;

  listenFunc: Function;
  itemizeds: any = [];
  suppliers: any = [];
  materials: any = [];
  stockUnits: any = [];
  // listFixed: any = [];
  // listChild: any = [];

  option_1: any;
  option_2: any;
  loggedUser: any = {};

  purchOrderDetailList: any = [];
  selectedPurchOrder: PurchOrderHeaderModel;
  supplierGroups: any = null;
  modelConfig: any = {
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };


  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private renderer: Renderer,
    private elementRef: ElementRef,
    public programService: ProgramService,
    private modalService: BsModalService,
    public userService: AuthService,
    private i18nService: I18nService,
    private generalMasterService: GeneralMasterService,
    public poSheetService: PoSheetService
  ) {
    super(userService)
    this.loggedUser = this.userService.getUserInfo();

    this.listenFunc = renderer.listen(elementRef.nativeElement, 'click', (event) => {
      if (event.target.classList.contains('check-box-po')) {
        var id = event.target.getAttribute('id');
        var value = event.target.getAttribute('value');
        this.checkPOSheet(id, value);
      }
    });
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {},
    // Messages for form validation
    messages: {}
  };

  ngOnInit() {
    this.checkPermission(ProgramList.PO_Sheet.valueOf())
    // this.purchDetail = this.poSheetService.getPurchOrderDetailModell();
    // this.purchDetail = new PurchOrderDetailModel();
    this.selectedPurchOrder = new PurchOrderHeaderModel();
    this.initDatatable_1();
    this.initDatatable_2();
    this.loadCommonData();
  }

  checkPOSheet(event, value) {
    var self = this;
    value = Number(value);
    event = Number(event);
    this.supplierGroups = this.supplierGroups.map(function (item) {
      if (item.customerCd === event && value === 0) {
        item.poNoStatus = 'Y';
        item.check = true;
        self.onRowClick(item);
      } else if (item.customerCd == event && value === 1) {
        item.poNoStatus = 'N';
        item.check = false;
        self.onRowClick({items: []});
      }
      return item;
    });
    let table = $('.tableGetPO').DataTable();
    table.clear();
    table.rows.add(this.supplierGroups).draw();
    // var pad = "000";
    // _.forEach(this.listFixed, (item, index) => {

    //   if (index >= 9) {
    //     pad = '00'
    //   }
    //   if (index >= 99) {
    //     pad = '0'
    //   }
    //   var genId = pad.substring(0, pad.length - this.listFixed.length) + (index + 1)
    //   if (item.poNoStatus === 'Y') {
    //     if (item.poNoCustomer === null) {
    //       item.poNoCustomer = this.purchDetail.poSheetNo + '-' + genId;
    //     }
    //     else {
    //       item.poNoCustomer = item.poNoCustomer;
    //     }
    //     _.forEach(this.listChild, (item, index) => {
    //       if (index >= 9) {
    //         pad = '00'
    //       }
    //       if (index >= 99) {
    //         pad = '0'
    //       }
    //       var genId = pad.substring(0, pad.length - this.listChild.length) + (index + 1)
    //       if (item.poUniqueNo === null) {
    //         item.poUniqueNo = this.purchDetail.poSheetNo + '-' + genId;
    //       }
    //       else {
    //         item.poUniqueNo = item.poUniqueNo;
    //       }
    //     });
    //   }
    // });
    // console.log('bbbbbbbbbbbbb', this.listFixed)
    // console.log('aaaaaaaaaaaaa', this.listChild)

  }

  selectPOSheet(purchDetail) {
    var poSheetNo = purchDetail.poSheetNo;
    if (!poSheetNo) {
      this.notification.showWarning('PO Sheet No not exist. Please choose another.');
      return;
    }
    return this.poSheetService.getPurchOrderHeaderById(poSheetNo).then(rs => {
      if (!rs.success) {
        this.notification.showWarning('PO Sheet No not exist. Please choose another.');
        return;
      }
      this.selectedPurchOrder = _.clone(rs.data || new PurchOrderHeaderModel());
      this.purchOrderDetailList = _.sortBy(_.clone(rs.data.purchOrderDetailList), 'poNoCustomer');
      this.groupSuppiler(poSheetNo, this.purchOrderDetailList);
      // var purchOrderDetailFixed = rs.data.purchOrderDetailList.reduce((groups, item) => {
      //   //Find index that item has same 'customerCd'
      //   let indx = groups.findIndex(element => element.customerCd === item.customerCd);
      //   if (indx < 0) {
      //     //If not found, add new object to return function
      //     item.detailTotal = {
      //       ps: '',
      //       supplier: item.customerCd,
      //       items: 1,
      //       poAmount: item.amount,
      //       poNoStatus: "N",
      //       poNoCustomer: null,
      //     }
      //     groups.push(item);
      //   }
      //   else {
      //     //If found, recalculation value of object that has same 'materialCd' and 'colorId'  
      //     groups[indx].detailTotal.poAmount += item.amount;
      //     groups[indx].detailTotal.items++;
      //   }
      //   return groups;
      // }, []);
      // this.listFixed = purchOrderDetailFixed.map(item => item.detailTotal);
      let table = $('.tableGetPO').DataTable();
      table.clear();
      table.rows.add(this.supplierGroups).draw();
      this.onRowClick({items: []});
      return true;
    });
  }


  groupSuppiler(poSheetNo, list) {
    var groups = _.groupBy(list, 'customerCd');
    this.supplierGroups = _.map(groups, function (items, key) {
      var obj = {
        check: false,
        customerCd: Number(key),
        poAmount: _.sumBy(items, 'amount'),
        items: items,
        poNoStatus: 'N',
        poSheetNo: poSheetNo,
        updated: false
      };
      var updated = _.find(items, function(i){
        return i.poNoStatus === 'Y';
      });
      if(updated){
        obj.poNoStatus = updated.poNoStatus;
        obj.check = true;
        obj.updated = true;
      }
      return obj;
    });
    this.generatePoNo(this.supplierGroups);
    _.forEach(this.supplierGroups, (item) => {
      this.generatePoNo(item.items, item);
    });
  }

  generatePoNo(list, parent = null) {
    var pad = '000', str = '2';
    _.forEach(list, (item, index) => {
      if (index >= 9) {
        pad = '00'
      }
      if (index >= 99) {
        pad = '0'
      }
      var genId = pad.substring(0, pad.length - str.length) + (index + 1);
      if (!parent && !item.poNoCustomer) {
        item.poNoCustomer = item.poSheetNo + genId;
      } else if (parent) { 
        item.poNoCustomer = parent.poNoCustomer;
        if(!item.poUniqueNo){
          item.poUniqueNo = parent.poNoCustomer + genId;
        }
      }
    });
  }



  showPOSheetPopup() {
    this._poSheetModalRef = this.modalService.show(this.popupPOSheet, this.modelConfig);
  }

  closePOSheetPopup() {
    this._poSheetModalRef && this._poSheetModalRef.hide();
  }

  private initDatatable_1() {
    this.option_1 = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        callback({
          aaData: []
        });
      },
      columns: [
        {
          render: function (data, type, full, meta) {
            var index = meta.row;
            return ++index;
          }, className: "center", width: "1%"
        },
        {
          render: function (data, type, row) {
            if (row.check && row.updated) {
              return '<input type="checkbox" disabled  id="' + row.customerCd + '" value="1" class="check-box-po" checked>';
            }else if (row.check && !row.updated) {
              return '<input type="checkbox" id="' + row.customerCd + '" value="1" class="check-box-po" checked>';
            }
            return '<input type="checkbox"  id="' + row.customerCd + '" value="0" class="check-box-po">';
          },
          width: "5%", className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            var customer_cd = this.suppliers.find(function (item) {
              return item.traderid === data.customerCd
            })
            return (customer_cd && customer_cd.traderlocalnm) || data.customerCd;
          },
          className: "center", width: "8%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.items.length;
          },
          className: "center", width: "6%"
        },
        // { data: "items", width: "5%", className: "center" },
        {
          data: "poAmount", className: "right", width: "5%",
          render: $.fn.dataTable.render.number(",", ".", 0)
        },
        { data: "poNoStatus", className: "center", width: "8%" },
        { data: "poNoCustomer", width: "10%", className: "center" },
      ],
      pageLength: 25,
      scrollX: true,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            // this.detailInfo = new GeneralMasterModel();
          }
        },
      ]
    };
  }

  private initDatatable_2() {
    this.option_2 = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        callback({
          aaData: []
        });
      },
      columns: [
        {
          render: function (data, type, full, meta) {
            var index = meta.row;
            return ++index;
          }, className: "center", width: "1%"
        },
        // { data: "itemizedGenCd", width: "8%", className: "word-wrap" },
        {
          data: (data, type, dataToSet) => {
            var itemized = this.itemizeds.find(function (item) {
              return item.gen_cd === data.itemizedGenCd;
            });
            return (itemized && itemized.gen_nm) || data.itemizedGenCd
          },
          className: "center", width: "8%"
        },
        // { data: "materialCd", width: "20%", className: "word-wrap" },
        {
          data: (data, type, dataToSet) => {
            var material = this.materials.find(function (item) {
              return item.materialSeq === data.materialCd;
            });
            return (material && material.materialFullNm) || ''
          },
          className: "center", width: "8%"
        },
        { data: "materialCd", width: "8%", className: "center" },
        // { data: "remark", width: "5%", className: "word-wrap" },
        // { data: "poQty", width: "5%", className: "word-wrap", render: $.fn.dataTable.render.number(',', '.', 0, '') },
        // { data: "price", width: "7%", className: "word-wrap", render: $.fn.dataTable.render.number(',', '.', 0, '') },
        // { data: "amount", width: "10%", className: "word-wrap", render: $.fn.dataTable.render.number(',', '.', 0, '') },
        {
          data: "poQty", className: "center", width: "5%",
          render: $.fn.dataTable.render.number(",", ".", 0)
        },
        {
          data: "price", className: "right", width: "5%",
          render: $.fn.dataTable.render.number(",", ".", 0)
        },
        {
          data: "amount", className: "right", width: "5%",
          render: $.fn.dataTable.render.number(",", ".", 0)
        },
        { data: "poUniqueNo", width: "20%", className: "center" },
      ],
      pageLength: 25,
      scrollX: true,
      //scrollY: 400,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            // this.detailInfo = new GeneralMasterModel();
          }
        },
      ]
    };
  }

  printPOSheet() {
    var self = this;
    this.notification.showCenterLoading();
    var updates = _.filter(this.supplierGroups, function (item) {
      return item.check && !item.updated;
    });
    if (updates.length === 0) {
      this.notification.hideCenterLoading();
      this.notification.showError('Please select Supplier for print.');
      return;
    }
    var reqs = [];
    _.forEach(updates, function (u) {
      _.forEach(u.items, function (item) {
        item.poNoStatus = 'Y';
        reqs.push(self.poSheetService.updatePurchOrderDetail(item));
      });
    });
    return Promise.all(reqs).then(function (rs) {
      var result = rs && rs[0];
      self.notification.hideCenterLoading();
      if(result.success){
        self.notification.showSuccess(result.message || 'Print PO Sheet successfully!');
        return self.selectPOSheet(self.selectedPurchOrder);
      }
      return false;
    }).then(function(result){
      if(result){
        var purchOrderDetailList  = self.purchOrderDetailList;
        var count = _.filter(purchOrderDetailList, function(p){
          return p.poNoStatus === 'Y';
        });
        console.log(count.length);
        var status = 'N';
        if(purchOrderDetailList.length > count.length){
          status = 'ING'
        }
        if(purchOrderDetailList.length > 0 && purchOrderDetailList.length === count.length ){
          status = 'Y'
        }
        var all = _.map(purchOrderDetailList, function(item){
          item.poSheetNoStatus = status;
          return self.poSheetService.updatePurchOrderDetail(item);
        });
        return Promise.all(all);
      }
    });
  }

  onReset() {
    this.selectedPurchOrder = new PurchOrderHeaderModel();
    this.supplierGroups = null;
    let table = $('.tableGetPO').DataTable();
    table.clear();
    table.rows.add([]).draw();
    let table_2 = $('.tableSubPO').DataTable();
    table_2.clear();
    table_2.rows.add([]).draw();
  }

  onRowClick(event) {
    // var f = $("form.frm-search").validate();
    // if (!f.valid()) {
    //   f.resetForm();
    // }
    setTimeout(() => {
      // this.listChild = this.purchOrderDetailList.filter(function (item) {
      //   return item.customerCd === event.supplier;
      // });
      let table = $('.tableSubPO').DataTable();
      table.clear();
      table.rows.add(event.items).draw();
    }, 100);
  }

  private loadCommonData() {
    return Promise.all([this.getAllSupplier(), this.getAllItemized(), this.getAllMaterial()]);
  }

  private getAllSupplier() {
    return this.api.get(`customer/suppliers`).subscribe(data => {
      if (!data.success) {
        return;
      }
      this.suppliers.push(...data.data)
    });
  }

  private getAllItemized() {
    return this.generalMasterService.listGeneralByCate(Category.Itemized.valueOf()).then(data => this.itemizeds.push(...data));
  }

  private getAllMaterial() {
    return this.api.get(`api/v1/mas_material`).subscribe(data => {
      if (!data.success) {
        return;
      }
      this.materials.push(...data.data)
    });
  }

  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf()).then(data => this.stockUnits.push(...data));
  }

}