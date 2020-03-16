import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomRenderSmartTableWorkOrderInputComponent } from '../../common/input-editor.component';
import { CustomRenderSmartTableWorkOrderInputCurrencyComponent } from '../../common/input-currency-editor.component';
import { CustomRenderSmartTableWorkOrderInputFloatComponent } from '../../common/input-float-editor.component';
import { CustomRenderSmartTableWorkOrderSelect2Component } from '../../common/select2-editor.component';
import { WorkOrderMasterService } from "@app/core/services/features.services/work-order-master.service";
import { MaterialMasterService } from "@app/core/services/features.services/material-master-service";
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { CommonFunction } from '@app/core/common/common-function';

import * as _ from "lodash";

@Component({
  selector: 'sa-work-order-sub-material',
  templateUrl: './work-order-sub-material.component.html',
  styleUrls: ['./work-order-sub-material.component.css'],
  entryComponents: [
    CustomRenderSmartTableWorkOrderInputComponent, CustomRenderSmartTableWorkOrderInputCurrencyComponent, CustomRenderSmartTableWorkOrderSelect2Component,
    CustomRenderSmartTableWorkOrderInputFloatComponent
  ]
})
export class WorkOrderSubMaterialComponent extends BasePage implements OnInit {
  @Input() woNo: number = null;
  @Input() stepSeq: boolean = false;
  @Input() styleSysId: number = null;
  @Input() styleColorsList: any = [];
  @Input() yields: any = [];
  @Input() constructions: any = [];
  @Input() stockUnits: any = [];
  @Input() specMasters: any = [];
  @Input() colors: any = [];

  materials: any = [];
  styleColors: any = [];
  constructColors: any = [];
  itemized: any = null;

  subSource: LocalDataSource = new LocalDataSource();
  data: any[];
  subSettings: object = {
    actions: false
  };
  constructor(public userService: AuthService,
    public programService: ProgramService,
    private generalMasterService: GeneralMasterService,
    private i18nService: I18nService,
    private materialMasterService: MaterialMasterService,
    private workOrderMasterService: WorkOrderMasterService,
    public styleMasterService: StyleMasterService
  ) {
    super(userService);
  }


  ngOnInit() {
    var self = this;
    self.woNo = Number(self.woNo);
    self.styleSysId = Number(self.styleSysId);
    self.constructColors = _.filter(self.styleColorsList, function (item) {
      return !item.colorType;
    });
    self.styleColors = _.filter(self.styleColorsList, function (item) {
      return item.colorType;
    });
    self.subSource.load([]);
    // this.checkPermission(ProgramList.Account_Master.valueOf())
    self.loadAllData().then(function () {
      return self.loadMaterialList();
    }).then(function () {
      self.initTable();
    });
  }

  onReset(){
    this.subSource.load([]);
    this.data = [];
  }

  private initTable() {
    this.subSettings = {
      actions: false,
      filter: false,
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
        colorIdStyle: {
          title: this.i18nService.getTranslation('STYLE_COLOR'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderSelect2Component,
            config: {
              list: _.map(this.styleColors, (r) => {
                return { id: r.colorId, text: r.colorName }
              })
            }
          },
          valuePrepareFunction: (cell, row) => { return row.colorStyleName || '' }
        },
        materialCd: {
          title: this.i18nService.getTranslation('MATERIAL_NAME'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderSelect2Component,
            config: {
              list: _.map(this.materials, (r) => {
                return { id: r.materialSeq, text: r.materialFullNm }
              }),
              stockUnits: this.stockUnits,
              specMasters: this.specMasters,
              materials: this.materials
            },
          },
          valuePrepareFunction: (cell, row) => { return row.materialName || '' }
        },
        specWidth: {
          title: this.i18nService.getTranslation('Spec_Width'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value: any) => { return value }
        },
        unit: {
          title: this.i18nService.getTranslation('UNIT'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value: any) => { return value }
        },
        constructionGenCd: {
          title: this.i18nService.getTranslation('CONSTRUCTION'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderSelect2Component,
            config: {
              list: _.map(this.constructions, (r) => {
                return { id: r.gen_cd, text: r.gen_nm }
              }),
            },
          },
          valuePrepareFunction: (cell, row) => { return row.constructionName || '' }
        },
        colorId: {
          title: this.i18nService.getTranslation('COLOR'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderSelect2Component,
            config: {
              list: _.map(this.constructColors, (r) => {
                return { id: r.colorId, text: r.colorName }
              })
            },
          },
          valuePrepareFunction: (cell, row) => { return row.colorConstructName || '' }
        },
        materialQty: {
          title: this.i18nService.getTranslation('QTY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderInputCurrencyComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        netYield: {
          title: this.i18nService.getTranslation('NET_YY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderInputFloatComponent
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        lossYield: {
          title: this.i18nService.getTranslation('LOSS_YY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderInputFloatComponent
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        totalYield: {
          title: this.i18nService.getTranslation('TOTAL_YY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderInputFloatComponent
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        needQty: {
          title: this.i18nService.getTranslation('NEED_QTY'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value: any) => { return value }
        }
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header work-order-sub-material-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };
    this.subSource.load(this.data || []);
    setTimeout(function(){
      $('.work-order-sub-material-table .ng2-smart-filters').hide();
    },100);
  }
  
  onRowClick(event) {
    // var data = event.data || null;
  }

  calculateQty(colors){
    var self = this;
    self.colors = colors;
    self.data = _.map(self.data, function (item) {
      if(self.colors && self.colors[item.colorIdStyle]){
        item.materialQty = self.colors[item.colorIdStyle] && self.colors[item.colorIdStyle].total;
      }
      return self.getMoreInfo(item);
    });
    self.subSource.load(self.data);
  }
  
  private loadMaterialList() {
    var self = this;
    if (self.styleSysId && !self.woNo && !self.stepSeq) {
      return self.styleMasterService.getListStyleMasterMaterialByStyle(self.styleSysId).then(function (rs) {
        if (rs.success) {
          self.data = _.map(rs.data && rs.data.listSubMaterials, function (item) {
            if (self.colors && self.colors[item.colorIdStyle]) {
              item.materialQty = self.colors[item.colorIdStyle] && self.colors[item.colorIdStyle].total;
            }
            return self.getMoreInfo(item);
          });
        }
      });
    } else if (self.woNo && self.stepSeq){
      return self.workOrderMasterService.getWorkOrderMaterialById(self.woNo , self.stepSeq).then(function (rs) {
        var data = rs || [];
        self.data = _.filter(data, function (item) {
          var valid = _.find(self.materials, function (m) {
            return m.materialSeq === item.materialCd;
          });
          return valid !== null && valid !== undefined;
        });
        self.data = _.map(self.data, function (item) {
          if (self.colors && self.colors[item.colorIdStyle]) {
            item.materialQty = self.colors[item.colorIdStyle] && self.colors[item.colorIdStyle].total;
          }
          return self.getMoreInfo(item);
        });
      });
    }
  }

  private loadAllData() {
    return Promise.all([this.getRowMaterials()]);
  }

  private getRowMaterials() {
    var self = this;
    return self.generalMasterService.listGeneralByCate(Category.Itemized.valueOf()).then(data => {
      self.itemized = _.find(data, function (item) {
        return item.ck_value_1 === "2"
      });
      return this.materialMasterService.listMaterialMasterAll();
    }).then(function (materials) {
      self.materials = _.filter(materials, function (item) {
        return self.itemized && self.itemized.gen_cd === item.itemCateGenCd;
      });
    });
  }

  private getMoreInfo(data) {
    data.colorIdStyle = parseInt(data.colorIdStyle);
    data.colorId = parseInt(data.colorId);
    if (data.colorIdStyle) {
      var styleColor = _.find(this.styleColors, function (r) {
        return r.colorId === data.colorIdStyle;
      });
      data.colorStyleName = (styleColor && styleColor.colorName) || '';
    }

    if (data.materialCd) {
      var material = _.find(this.materials, function (r) {
        return r.materialSeq === data.materialCd;
      });
      data.materialName = '';
      if (material) {
        data.materialName = material.materialFullNm || '';
        var unit = _.find(this.stockUnits, { "gen_cd": material.stockUnitGenCd });
        if (unit) {
          data.unit = unit.gen_nm || '';
          data.unit_cd = material.stockUnitGenCd;
        }
        var spec = _.find(this.specMasters, { "gen_cd": material.specGenCd });
        if (spec) {
          data.specWidth = spec.gen_nm || '';
          data.spec_cd = material.specGenCd;
        }
      }
    }

    if (data.constructionGenCd) {
      var construction = _.find(this.constructions, function (r) {
        return r.gen_cd === data.constructionGenCd;
      });
      data.constructionName = (construction && construction.gen_nm) || '';
    }

    if (data.colorId) {
      var constructColor = _.find(this.constructColors, function (r) {
        return r.colorId === data.colorId;
      });
      data.colorConstructName = (constructColor && constructColor.colorName) || '';
    }

    let needQty = CommonFunction.FormatCurrency(data.materialQty) * (1 + CommonFunction.FormatCurrency(data.totalYield));
    data.needQty = Math.round(needQty);

    return data;
  }
}


