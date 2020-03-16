import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { ActivatedRoute } from '@angular/router';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';

import * as moment from 'moment';
import _ from 'lodash';
import { WorkOrderMasterModel, SearchWorkOrderModel } from '@app/core/models/work-order-master-model';
import { StyleMasterModel } from '@app/core/models/style-master-model';
import { rS } from '@angular/core/src/render3';

@Component({
  selector: 'sa-work-order-master',
  templateUrl: './work-order-master.component.html',
  styleUrls: ['../../../../assets/css/common_extra.css', '../../../../assets/css/smart-table.scss', "./work-order-master.component.css"],
  entryComponents: []
})
export class WorkOrderMasterComponent extends BasePage implements OnInit {
  @ViewChild("popupSearchStyle") popupSearchStyle;
  @ViewChild("popupSearchWorkOrder") popupSearchWorkOrder;
  @ViewChild("workOrderTypeTab") workOrderTypeTab;
  @ViewChild("rowMaterialTab") rowMaterialTab;
  @ViewChild("subMaterialTab") subMaterialTab;
  @ViewChild("workOrderImageTab") workOrderImageTab;


  _searchStyleModalRef: BsModalRef;
  _searchWorkOrderModalRef: BsModalRef;
  _swatchModalRef: BsModalRef;
  //
  disabledInning: boolean = false;
  buyers: any = [];
  brands: any = [];
  yields: any = [];
  constructions: any = [];
  stockUnits: any = [];
  specMasters: any = [];
  sampleSteps: any = [];
  allPOData: any = [];
  poList: any = [];
  poCSList: any = [];
  traderList: any = [];
  woNo: any = null;
  stepSeq: any = null;
  styleSysId: any = null;
  poId: any = ''; //'All';
  workOrderHeader: any;
  workTypeList: any = [];
  selectedStyle: StyleMasterModel;
  selectedPo: any = null;
  styleColorsList: any = [];
  sizeGroups: any = [];
  rows: any = [];
  colors: any = null;
  tab: number = 1;
  userLogin: any;
  isEdit: boolean = false;
  entryData = {
    date: '',
    user: ''
  };
  oldInning: any = null;
  modelConfig: any = {
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };
  inningList = [{
    value: 1,
    text: '1'
  }, {
    value: 2,
    text: '2'
  }, {
    value: 3,
    text: '3'
  }, {
    value: 4,
    text: '4'
  }, {
    value: 5,
    text: '5'
  }]
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    private generalMasterService: GeneralMasterService,
    private traderService: TraderService,
    private styleMasterService: StyleMasterService,
    private workOrderMasterService: WorkOrderMasterService,
    private route: ActivatedRoute,

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
      poId: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      styleNo: {
        required: 'Please select'
      },
      poId: {
        required: 'Please select'
      },
    }
  };

  ngOnInit() {
    var self = this;
    self.checkPermission(ProgramList.Work_Order_Create.valueOf());
    self.workOrderHeader = new WorkOrderMasterModel();
    self.selectedStyle = new StyleMasterModel();
    self.selectedStyle.orderType = true;
    self.loadCommonData().then(function () {
      self.buyers = _.filter(self.traderList, function (item) {
        return (item.type_gen_cd + '') === '170100110000';
      });
    });
  }

  showSearchStylePopup() {
    this._searchStyleModalRef = this.modalService.show(this.popupSearchStyle, this.modelConfig);
  }

  closeSearchStylePopup() {
    this._searchStyleModalRef && this._searchStyleModalRef.hide();
  }

  showSearchWorkOrderPopup() {
    this._searchWorkOrderModalRef = this.modalService.show(this.popupSearchWorkOrder, this.modelConfig);
  }

  closeSearchWorkOrderPopup() {
    this._searchWorkOrderModalRef && this._searchWorkOrderModalRef.hide();
  }

  selectStyle(item) {
    var self = this;
    self.styleSysId = item.styleSysId || null;
    self.selectedStyle = item;
    _.extend(self.workOrderHeader, {
      styleSysId: self.styleSysId,
      styleNo: item.styleNo,
    });
    return Promise.all([self.getStyleColorList(), self.getYieldByStyle()]).then(function () {
      return self.getPOList();
    }).then(function () {
      self.rowMaterialTab.ngOnInit();
      self.subMaterialTab.ngOnInit();
    });
  }

  reloadWorkOrder(item, reload = false) {
    var self = this;
    self.workOrderHeader = item;
    self.oldInning = _.clone(item.inning);
    self.woNo = item.woNo;
    self.stepSeq = item.stepSeq;
    self.styleSysId = item.styleSysId;
    self.isEdit = true;
    self.poId = item.poId; //item.poId === -1 ? 'All' : item.poId;
    self.entryData.date = moment(item.createdTime).format('YYYY.MM.DD');
    self.entryData.user = item.creator;
    return this.styleMasterService.getStyleById(self.styleSysId).then(function (rs) {
      if (rs.success) {
        self.selectedStyle = rs.data || null;
      }
    }).then(function () {
      return Promise.all([self.getStyleColorList(), self.getYieldByStyle()]).then(function () {
        return self.getPOList();
      }).then(function () {
        if (self.poId !== 'All') {
          self.poList = _.filter(self.allPOData, { 'poId': Number(self.poId) });
        } else {
          self.poList = self.allPOData;
        }
        var reqs = _.map(self.poList, function (po) {
          return self.getPOCSDetails(po.poId).then(function (data) {
            po.pocsList = data;
            return po;
          });
        });
        return Promise.all(reqs).then(function (poCS) {
          if (!reload) {
            self.composePoData(self.poList);
          }
        }).then(function () {
          if (self.woNo && self.stepSeq && !reload) {
            return self.loadWorkOrderCSData(self.woNo, self.stepSeq);
          }
        }).then(function () {
          if (!reload) {
            self.workOrderTypeTab.ngOnInit();
            self.rowMaterialTab.ngOnInit();
            self.subMaterialTab.ngOnInit();
            self.workOrderImageTab.ngOnInit();
          }
        });
      });
    })
  }

  selectWorkOrder(item) {
    var self = this;
    var seleted = item.selected;
    var list = item.workOrderList;
    var maxSeq = _.maxBy(list, function(m){
      return m.inning;
    });
    if(maxSeq.stepSeq !== seleted.stepSeq){
      self.disabledInning = true;
    }else{
      self.disabledInning = false;
    }
    self.inningList = _.map(self.inningList, function(i){
      i.disabled = i.value < maxSeq.inning;
      return i;
    });
    return self.workOrderMasterService.getWorkOrderById(seleted.woNo, seleted.stepSeq).then(function (rs) {
      if (rs.success)
        return self.reloadWorkOrder(rs.data);
    });
  }

  loadWorkType(data) {
    this.workTypeList = data;
  }

  onSubmit() {
    var self = this;
    self.notification.showCenterLoading();
    const _invalid = $("form.frm-work-order-detail").valid();
    if (!_invalid) {
      this.notification.hideCenterLoading();
      return;
    }

    var data = _.clone(self.workOrderHeader),
      workOrderTypeData = [],
      workOrderRowData = [],
      workOrderSubData = [],
      workOrderImageData = [],
      workOrderCs = _.clone(self.colors);
    //
    data.styleSysId = self.selectedStyle.styleSysId;
    data.poId = self.poId; //self.poId === 'All' ? -1 : self.poId;
    data.styleNo = self.selectedStyle.styleNo;
    data.buyer = self.selectedStyle.buyerCd;
    data.brand = self.selectedStyle.brandGenCd;
    data.poNo = (self.selectedPo && self.selectedPo.poNo) || '';
    if (self.workOrderTypeTab) {
      workOrderTypeData = self.workOrderTypeTab.workTypeList || [];
    }
    if (self.rowMaterialTab) {
      workOrderRowData = self.rowMaterialTab.data || [];
    }
    if (self.subMaterialTab) {
      workOrderSubData = self.subMaterialTab.data || [];
    }
    if (self.workOrderImageTab) {
      workOrderImageData = self.workOrderImageTab.data || [];
    }
    var req;
    if (!self.isEdit) {
      req = self.workOrderMasterService.insertWorkOrder(data);
    } else {
      req = self.workOrderMasterService.updateWorkOrder(data);
    }
    return req.then(rs => {
      self.notification.hideCenterLoading();
      if (rs.success) {
        var data = rs.data;
        var req_After ;
        if (!self.isEdit && !self.workOrderHeader.woNo) {
          self.notification.showSuccess(rs.message);
          req_After = self.reloadWorkOrder(data, true);
        } else if (self.isEdit && self.workOrderHeader.woNo && self.oldInning !== self.workOrderHeader.inning) {
          self.oldInning = self.workOrderHeader.inning;
          //
          workOrderTypeData = _.map(workOrderTypeData, function (t) {
            t.created = true;
            return t;
          });
          //
          workOrderRowData = _.map(workOrderRowData, function (m) {
            m.created = true;
            return m;
          });
          //
          workOrderSubData = _.map(workOrderSubData, function (m) {
            m.created = true;
            return m;
          });

          workOrderImageData = _.map(workOrderImageData, function (m) {
            m.created = true;
            return m;
          });
          //
          _.forEach(workOrderCs, function (cs) {
            _.forEach(cs.columns, function (c) {
              c.woNo = null;
              c.stepSeq = null;
            });
          });
          self.notification.showSuccess('Add work order with new inning successfully!');
          req_After = self.reloadWorkOrder(data, true);
        } else if (self.isEdit && self.workOrderHeader.woNo && self.oldInning === self.workOrderHeader.inning) {
          self.notification.showSuccess(rs.message);
          req_After = self.reloadWorkOrder(data, true);
        }
        return req_After.then(function () {
          self.inningList = _.map(self.inningList, function(i){
            i.disabled = i.value < self.workOrderHeader.inning;
            return i;
          });
          var reqs = [self.updateWorkOrderCS(workOrderCs, self.workOrderHeader), self.updateWorkType(workOrderTypeData, self.workOrderHeader),
          self.updateMaterial(workOrderRowData, self.workOrderHeader), self.updateMaterial(workOrderSubData, self.workOrderHeader)
            , self.updateWorkImage(workOrderImageData, self.workOrderHeader)];
          return Promise.all(reqs).then(function () {
            //reload Data;
            self.composePoData(self.poList);
            self.loadWorkOrderCSData(self.woNo, self.stepSeq);
            self.workOrderTypeTab.ngOnInit();
            self.rowMaterialTab.ngOnInit();
            self.subMaterialTab.ngOnInit();
            self.workOrderImageTab.ngOnInit();
          });
        });
      }else{
        self.notification.showError(rs.message);
      }
    });
  }

  updateWorkOrderCS(data, workOrder) {
    var self = this;
    var reqs = [];
    _.forEach(data, function (cs, key) {
      if (key !== 'total') {
        var colorId = cs.colorId;
        _.forEach(cs.columns, function (c) {
          if (!c.woNo && !c.stepSeq) {
            reqs.push(self.workOrderMasterService.insertWorkOrderCS({
              woNo: workOrder.woNo,
              stepSeq: workOrder.stepSeq,
              colorId: colorId,
              sizeId: c.sizeId,
              qty: c.qty
            }));
          } else {
            var model = _.clone(c);
            model.colorId = colorId;
            reqs.push(self.workOrderMasterService.updateWorkOrderCS(model));
          }
        });
      }
    });
    return Promise.all(reqs);
  }

  updateWorkType(data, workOrder) {
    var self = this;
    var reqs = _.map(data, function (w) {
      if (((!w.woNo && !w.stepSeq) || w.created) && !w.deleted) {
        return self.workOrderMasterService.insertWorkOrderWorkType({
          woNo: workOrder.woNo,
          stepSeq: workOrder.stepSeq,
          worktypeGenCd: w.worktypeGenCd,
          customerCd: Number(w.customerCd),
          remark: w.remark,
          description: w.remark
        });
      } else if (w.updated && !w.deleted) {
        return self.workOrderMasterService.updateWorkOrderWorkType(w);
      } else if (w.deleted && w.woNo && w.stepSeq) {
        return self.workOrderMasterService.deleteWorkOrderWorkType(w);
      } else {
        return Promise.all([]);
      }
    });
    return Promise.all(reqs);
  }

  updateMaterial(data, workOrder) {
    var self = this;
    var reqs = _.map(data, function (m) {
      if ((!m.woNo && !m.stepSeq) || m.created) {
        return self.workOrderMasterService.insertWorkOrderMaterial({
          woNo: workOrder.woNo,
          stepSeq: workOrder.stepSeq,
          colorIdStyle: m.colorIdStyle,
          colorId: m.colorId,
          materialCd: m.materialCd,
          itemizedGenCd: m.itemizedGenCd,
          constructionGenCd: m.constructionGenCd,
          materialQty: m.materialQty,
          netYield: m.netYield,
          lossYield: m.lossYield,
          totalYield: m.totalYield,
          needQty: m.needQty,
        });
      } else {
        return self.workOrderMasterService.updateWorkOrderMaterial(m);
      }
    });
    return Promise.all(reqs);
  }

  updateWorkImage(data, workOrder) {
    var self = this;
    var reqs = _.map(data, function (m) {
      if ((!m.woNo && !m.stepSeq) || m.created) {
        var model = _.clone(m);
        model.woNo = workOrder.woNo;
        model.stepSeq = workOrder.stepSeq;
        model.uploadSeq = 0;
        return self.workOrderMasterService.insertWorkOrderImage(model);
      } else {
        return Promise.all([]);
      }
    });
    return Promise.all(reqs);
  }

  onReset() {
    $("form.frm-work-order-detail").validate().resetForm();
    this.workOrderHeader = new WorkOrderMasterModel();
    this.workOrderMasterService.storeWorkOrderMasterModel(this.workOrderHeader);
    this.woNo = null;
    this.stepSeq = null;
    this.styleSysId = null;
    this.isEdit = false;
    this.selectedStyle = new StyleMasterModel();
    this.selectedStyle.orderType = true;
    this.disabledInning = false;
    this.rows = [];
    this.colors = null;
    this.tab = 1;
    this.poId = ''; //'All';
    this.entryData.date = moment().format('YYYY.MM.DD');
    this.entryData.user = this.loggedUser.user_name;
    this.rowMaterialTab.onReset();
    this.subMaterialTab.onReset();
    this.workOrderImageTab.onReset();
    this.workOrderTypeTab.onReset();
    // $("#poId").val('').trigger();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  activeTab() {
    // if (this.tab === 2) {
    //   this.rowMaterialTab.ngOnInit();
    // }
    // if (this.tab === 3) {
    //   this.subMaterialTab.ngOnInit();
    // }
  }

  onChangePO(value) {
    var self = this;
    if (value === 'All') {
      self.poList = self.allPOData;
      self.selectedPo = null;
    } else {
      self.poList = _.filter(self.allPOData, { 'poId': Number(value) });
      self.selectedPo = (self.poList && self.poList[0]) || null;
    }
    var reqs = _.map(self.poList, function (po) {
      return self.getPOCSDetails(po.poId).then(function (data) {
        po.pocsList = data;
        return po;
      });
    });
    return Promise.all(reqs).then(function (poCS) {
      self.composePoData(self.poList);
    }).then(function () {
      if (self.woNo && self.stepSeq) {
        return self.loadWorkOrderCSData(self.woNo, self.stepSeq);
      }
    }).then(function () {
      self.rowMaterialTab.calculateQty(self.colors);
      self.subMaterialTab.calculateQty(self.colors);
    });
  }

  caculateTotalSizeColumn(sizeId, final = false) {
    var total = 0;
    _.forEach(this.colors, function (c) {
      if (!c.totalRow && c.columns && c.columns.length > 0) {
        if (final) {
          total += c.total;
        } else {
          var e = _.find(c.columns, { 'sizeId': Number(sizeId) });
          if (e) {
            total += e.qty;
          }
        }

      }
    });
    return total;
  }

  caculateTotalSizeRow(item) {
    item.total = _.sumBy(item.columns, "qty");
    this.caculateTotalSizeColumn(item.sizeId);
    this.caculateTotalSizeColumn('', true);
    if (this.tab === 2) {
      this.rowMaterialTab.calculateQty(this.colors);
    }
    if (this.tab === 3) {
      this.subMaterialTab.calculateQty(this.colors);
    }
  }

  loadWorkOrderCSData(woNo, stepSeq) {
    var self = this;
    return self.workOrderMasterService.getWorkOrderCSById(woNo, stepSeq).then(function (rs) {
      var orderCSData = rs || [];
      _.forEach(orderCSData, function (cs) {
        if (self.colors[cs.colorId] && self.colors[cs.colorId].columns) {
          _.forEach(self.colors[cs.colorId].columns, function (col) {
            (cs);
            if (col.sizeId === cs.sizeId) {
              col.qty = cs.qty;
              col.woNo = cs.woNo;
              col.stepSeq = cs.stepSeq;
            }
          });
          self.colors[cs.colorId].total = _.sumBy(self.colors[cs.colorId].columns, "qty");
        }
      });
    });
  }

  private loadCommonData() {
    return Promise.all([this.loadBrand(), this.getAllTrader(), this.getSampStepList(), this.getSizeGroup(), this.getConstruction(), this.getStockUnit(), this.getSpec()]);
  }

  private getSizeGroup() {
    return this.generalMasterService.listGeneralByCate(Category.SizeGroup.valueOf()).then(data => this.sizeGroups.push(...data));
  }

  private loadBrand() {
    return this.styleMasterService.getStyleBrand().then(rs => {
      if (rs.success) {
        this.brands = _.map(rs.data || [], function (i) {
          return {
            gen_cd: i.geN_CD || i.gen_cd,
            gen_nm: i.geN_NM || i.gen_nm
          };
        });
      }
    });
  }

  private getConstruction() {
    return this.generalMasterService.listGeneralByCate(Category.Contruction.valueOf()).then(data => this.constructions.push(...data));
  }

  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf()).then(data => this.stockUnits.push(...data));
  }

  private getSpec() {
    return this.generalMasterService.listGeneralByCate(Category.SpecCode.valueOf()).then(data => this.specMasters.push(...data));
  }


  private getAllTrader() {
    return this.traderService.ListTrader(this.companyInfo.company_id).then(data => this.traderList.push(...data));
  }

  private getSampStepList() {
    return this.generalMasterService.listGeneralByCate(Category.SampleStep.valueOf()).then(data => this.sampleSteps.push(...data));
  }

  private getPOList() {
    var self = this;
    if (self.styleSysId) {
      return self.styleMasterService.getStyleMasterPOByStyle(self.styleSysId).then(function (rs) {
        self.poList = self.allPOData = rs.success ? (rs.data || []) : [];
        return self.poList;
      }).then(function () {
        var reqs = _.map(self.poList, function (po) {
          return self.getPOCSDetails(po.poId).then(function (data) {
            po.pocsList = data;
            return po;
          });
        });
        return Promise.all(reqs);
      }).then(function (poCS) {
        //self.composePoData(self.poList);
        return true;
      });
    }
  }


  private getYieldByStyle() {
    var self = this;
    return self.styleMasterService.getStyleMasterYieldByStyleId(self.styleSysId).then(rs => {
      self.yields = rs.success ? (rs.data || []) : [];
    });
  }

  private getStyleColorList() {
    var self = this;
    if (self.styleSysId) {
      return this.styleMasterService.getStyleMasterColorByStyle(self.styleSysId).then(rs => {
        self.styleColorsList = rs.success ? (rs.data || []) : [];
      });
    }
  }

  private getPOCSDetails(value) {
    return this.styleMasterService.getStyleMasterPOCSByPo(value).then(function (rs) {
      var data = rs.success ? (rs.data || []) : [];
      return data;
    });
  }

  private composePoData(list) {
    var self = this;
    self.rows = [];
    self.colors = null;
    var colors = {};
    _.forEach(list, function (po) {
      var selectedSize = _.find(self.sizeGroups, { "gen_cd": po.sizeGroupGenCd });
      if (selectedSize) {
        var arr = selectedSize.gen_nm.split('-');
        if (arr && arr.length > 0) {
          var rows = _.map(arr, (item, index) => {
            var obj = {
              name: 'Size ' + item.trim(),
              sizeId: Number(item.trim()),
            };
            return obj;
          });
          self.rows = _.uniqBy(self.rows.concat(rows), 'name');
        }
      }

      if (po.pocsList && po.pocsList.length > 0) {
        var colorGroups = _.groupBy(po.pocsList, "colorId");
        _.forEach(colorGroups, function (item, colorId) {
          var colorStyle = _.find(self.styleColorsList, { "colorId": Number(colorId) });
          if (!colors[colorId]) {
            colors[colorId] = colorStyle || { colorId: colorId };
            colors[colorId].columns = _.map(item, (i, index) => {
              var obj = {
                name: 'Size ' + i.sizeId,
                sizeId: i.sizeId,
                qty: Number(i.qty),
                id: CommonFunction.generateId()
              };
              return obj;
            });
            colors[colorId].id = CommonFunction.generateId();
            colors[colorId].total = _.sumBy(colors[colorId].columns, "qty");
          } else {
            _.forEach(item, (i, index) => {
              var index = _.findIndex(colors[colorId].columns, function (f) {
                return f.sizeId === i.sizeId;
              });
              if (index === -1) {
                colors[colorId].columns.push({
                  name: 'Size ' + i.sizeId,
                  sizeId: i.sizeId,
                  qty: Number(i.qty),
                  id: CommonFunction.generateId()
                });
              } else {
                colors[colorId].columns[index].qty += Number(i.qty);
              }
              colors[colorId].total = _.sumBy(colors[colorId].columns, "qty");
            });
          }
        });
      }
    });

    var keys = Object.keys(colors);
    if (keys && keys.length > 0) {
      var key = keys[0];
      let columns = _.clone(colors[key].columns);
      colors['total'] = {
        colorName: 'CS_TOTAL',
        columns: columns,
        totalRow: true,
        total: 0
      };
    }
    self.colors = colors;

  }
}

