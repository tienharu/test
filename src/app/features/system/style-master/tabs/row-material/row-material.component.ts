import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { BsModalService } from 'ngx-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomRenderSmartTableStyleInputComponent } from '../../common/input-editor.component';
import { CustomRenderSmartTableStyleInputCurrencyComponent } from '../../common/input-currency-editor.component';
import { CustomRenderSmartTableStyleSelect2Component } from '../../common/select2-editor.component';
import { CustomRenderSmartTableStyleInputFloatComponent } from '../../common/input-float-editor.component';
import { CommonFunction } from "@app/core/common/common-function";
import { StyleMasterService } from "@app/core/services/features.services/style-master.service";
import { MaterialMasterService } from "@app/core/services/features.services/material-master-service";
import * as _ from "lodash";
@Component({
  selector: 'sa-row-material',
  templateUrl: './row-material.component.html',
  styleUrls: ['../../../../../../assets/css/smart-table.scss', './row-material.component.css'],
  entryComponents: [
    CustomRenderSmartTableStyleInputComponent, CustomRenderSmartTableStyleInputCurrencyComponent, CustomRenderSmartTableStyleSelect2Component, CustomRenderSmartTableStyleInputFloatComponent
  ]
})

export class RowMaterialComponent extends BasePage implements OnInit {
  @Output() onRowMaterialClick = new EventEmitter();
  @Input() styleSysId: number = null;
  @Input() styleType: boolean = false;
  constructions: any = [];
  stockUnits: any = [];
  specMasters: any = [];
  materials: any = [];
  styleColors: any = [];
  constructColors: any = [];
  yields: any = [];
  itemized: any = null;

  rowSource: LocalDataSource = new LocalDataSource();
  data: any[];
  rowSettings: object = {
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
  };
  constructor(public userService: AuthService,
    public programService: ProgramService,
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private generalMasterService: GeneralMasterService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    private styleMasterService: StyleMasterService,
    private materialMasterService: MaterialMasterService
  ) {
    super(userService);
  }


  ngOnInit() {
    var self = this;
    // self.styleSysId = Number(self.styleSysId);
    // this.checkPermission(ProgramList.Account_Master.valueOf())
    self.data = [];
    self.loadAllData().then(function () {
      return self.loadMaterialList();
    }).then(function () {
      self.initTable();
    });
  }

  onReset() {
    this.rowSource.load([]);
    this.data = [];
  }

  reloadRegistColorData() {
    var self = this;
    return Promise.all([self.getStyleColors(), self.getConstructColors()]).then(function () {
      self.data = _.map(self.data, function (item, index) {
        return self.getMoreInfo(item);
      });
      self.initTable();
    });
  }
  
  reloadRegistYieldData() {
    var self = this;
    self.getYieldByStyle().then(function () {
      self.initTable();
    });
  }

  public validationOptions: any = {
    ignore: [],
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

  private initTable() {
    var self = this;
    self.rowSettings = {
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
            component: CustomRenderSmartTableStyleSelect2Component,
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
            component: CustomRenderSmartTableStyleSelect2Component,
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
            component: CustomRenderSmartTableStyleSelect2Component,
            config: {
              list: _.map(this.constructions, (r) => {
                return { id: r.gen_cd, text: r.gen_nm }
              }),
              yields: this.yields,
              main: this.styleType
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
            component: CustomRenderSmartTableStyleSelect2Component,
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
            component: CustomRenderSmartTableStyleInputCurrencyComponent,
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
            component: CustomRenderSmartTableStyleInputFloatComponent
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
            component: CustomRenderSmartTableStyleInputFloatComponent
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
            component: CustomRenderSmartTableStyleInputFloatComponent
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
        class: 'table table-bordered fixed_header row-material-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };
    self.rowSource.load(self.data || []);
    setTimeout(function () {
      if (!self.styleSysId) {
        console.log($('.row-material-table .ng2-smart-filters'));
        $('.row-material-table .ng2-smart-filters').hide();
      } else {
        $('.row-material-table .ng2-smart-filters').show();
      }
    }, 10);

  }

  onCreateConfirm(event) {
    var self = this;
    self.notification.showCenterLoading();
    var data = event.newData;
    data.id = CommonFunction.generateId();
    if (data.materialQty === "") {
      data.materialQty = 0;
    }
    if (data.netYield === "") {
      data.netYield = 0;
    }
    if (data.lossYield === "") {
      data.lossYield = 0;
    }
    if (data.totalYield === "") {
      data.totalYield = 0;
    }
    if (data.needQty === "") {
      data.needQty = 0;
    }
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.color_id_style_valid) {
      self._notifyInValidField('colorIdStyle_0', false, 'select');
      invalid = true;
    }
    if (!valid.color_id_valid) {
      self._notifyInValidField('colorId_0', false, 'select');
      invalid = true;
    }
    if (!valid.construction_gen_cd_valid) {
      self._notifyInValidField('constructionGenCd_0', false, 'select');
      invalid = true;
    }
    if (!valid.material_cd_valid) {
      self._notifyInValidField('materialCd_0', false, 'select');
      invalid = true;
    }
    if (!valid.net_valid) {
      self._notifyInValidField('netYield_0', false);
      invalid = true;
    }
    if (!valid.loss_valid) {
      self._notifyInValidField('lossYield_0', false);
      invalid = true;
    }
    if (!valid.total_valid) {
      self._notifyInValidField('totalYield_0', false);
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('colorIdStyle_0', true, 'select');
    self._notifyInValidField('colorId_0', true);
    self._notifyInValidField('constructionGenCd_0', true);
    self._notifyInValidField('materialCd_0', true, 'select');
    self._notifyInValidField('netYield_0', true);
    self._notifyInValidField('lossYield_0', true);
    self._notifyInValidField('totalYield_0', true);
    data = self.getMoreInfo(data);
    data.styleSysId = self.styleSysId;
    data.itemizedGenCd = self.itemized.gen_cd;
    data.materialModel = {
      SpecGenCd: data.spec_cd,
      SpecGenNm: data.specWidth,
      StockUnitGenCd: data.unit_cd,
      StockUnitGenNm: data.unit,
    };
    data.netYield = Number(data.netYield);
    data.lossYield = Number(data.lossYield);
    data.totalYield = Number(data.totalYield);
    data.materialQty = Number(data.materialQty);
    data.needQty = Number(data.needQty);
    return self.styleMasterService.insertStyleMasterMaterial(data).then(function (rs) {
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
    if (data.materialQty === "") {
      data.materialQty = 0;
    }
    if (data.netYield === "") {
      data.netYield = 0;
    }
    if (data.lossYield === "") {
      data.lossYield = 0;
    }
    if (data.totalYield === "") {
      data.totalYield = 0;
    }
    if (data.needQty === "") {
      data.needQty = 0;
    }
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.color_id_style_valid) {
      self._notifyInValidField('colorIdStyle', false, 'select');
      invalid = true;
    }
    if (!valid.color_id_valid) {
      self._notifyInValidField('colorId', false, 'select');
      invalid = true;
    }
    if (!valid.construction_gen_cd_valid) {
      self._notifyInValidField('constructionGenCd', false, 'select');
      invalid = true;
    }
    if (!valid.material_cd_valid) {
      self._notifyInValidField('materialCd', false, 'select');
      invalid = true;
    }
    if (!valid.net_valid) {
      self._notifyInValidField('netYield', false);
      invalid = true;
    }
    if (!valid.loss_valid) {
      self._notifyInValidField('lossYield', false);
      invalid = true;
    }
    if (!valid.total_valid) {
      self._notifyInValidField('totalYield', false);
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('colorIdStyle', true, 'select');
    self._notifyInValidField('colorId', true);
    self._notifyInValidField('constructionGenCd', true);
    self._notifyInValidField('materialCd', true, 'select');
    self._notifyInValidField('netYield', true);
    self._notifyInValidField('lossYield', true);
    self._notifyInValidField('totalYield', true);
    data = self.getMoreInfo(data);
    data.netYield = Number(data.netYield);
    data.lossYield = Number(data.lossYield);
    data.totalYield = Number(data.totalYield);
    data.materialQty = Number(data.materialQty);
    data.needQty = Number(data.needQty);
    return self.styleMasterService.updateStyleMasterMaterial(data).then(function (rs) {
      self.notification.hideCenterLoading();
      if (rs && rs.success) {
        self.notification.showSuccess(rs.messages || 'Update successful.');
        //event.confirm.resolve(data);
        return self.loadMaterialList().then(function () {
          self.rowSource.load(self.data);
        })
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
          return self.styleMasterService.deleteStyleMasterMaterial(self.styleSysId, data.materialCd, data.colorIdStyle).then(function (rs) {
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

  onRowClick(event) {
    var data = event.data || null;
    this.onRowMaterialClick.emit(data);
  }

  private checkValidTableInput(data) {
    var result = {
      color_id_style_valid: data.colorIdStyle && (data.colorIdStyle + '').trim() !== '',
      material_cd_valid: data.materialCd && (data.materialCd + '').trim() !== '',
      construction_gen_cd_valid: data.constructionGenCd && (data.constructionGenCd + '').trim() !== '',
      color_id_valid: data.colorId && (data.colorId + '').trim() !== '',
      net_valid: data.netYield >= 0 && data.netYield < 10,
      loss_valid: data.lossYield >= 0 && data.lossYield < 10,
      total_valid: data.totalYield >= 0 && data.totalYield < 10
    };
    return result;
  }

  private _notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  private loadMaterialList() {
    var self = this;
    if (self.styleSysId && self.styleSysId !== 0) {
      return self.styleMasterService.getListStyleMasterMaterialByStyle(self.styleSysId).then(function (rs) {
        if (rs.success) {
          self.data = _.map(rs.data && rs.data.listRowMaterials, function (item, index) {
            item.index = index;
            item.id = CommonFunction.generateId();
            return self.getMoreInfo(item);
          });
        }
      });
    }
  }

  private loadAllData() {
    return Promise.all([this.getStyleColors(), this.getConstructColors(), this.getConstruction(), this.getRowMaterials(), this.getStockUnit(), this.getSpec(), this.getYieldByStyle()]);
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

  private getRowMaterials() {
    var self = this;
    return self.generalMasterService.listGeneralByCate(Category.Itemized.valueOf()).then(data => {
      self.itemized = _.find(data, function (item) {
        return item.ck_value_1 === "1"
      });
      return this.materialMasterService.listMaterialMasterAll();
    }).then(function (materials) {
      self.materials = _.filter(materials, function (item) {
        return self.itemized && self.itemized.gen_cd === item.itemCateGenCd;
      });
    });
  }

  private getStyleColors() {
    var self = this;
    return this.styleMasterService.getStyleMasterColorByType(true).then(rs => {
      if (rs.success) {
        self.styleColors = _.filter(rs.data, function (item) {
          return self.styleSysId === item.styleSysId;
        });
      }
    });
  }

  private getConstructColors() {
    var self = this;
    return this.styleMasterService.getStyleMasterColorByType(false).then(rs => {
      if (rs.success) {
        self.constructColors = _.filter(rs.data, function (item) {
          return self.styleSysId === item.styleSysId;
        });
      }
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

    return data;
  }

  private getYieldByStyle() {
    var self = this;
    return this.styleMasterService.getStyleMasterYieldByStyleId(this.styleMasterService).then(rs => {
      if (rs.success) {
        this.yields = rs.data;
      }
    });
  }
}


