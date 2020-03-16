import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { ActivatedRoute } from '@angular/router';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { DueOutMaterialService } from '@app/core/services/features.services/due-out-material.service';
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';
import * as moment from 'moment';
import _ from 'lodash';
import { DueOutMaterialModel, DueOutMaterialTableModel } from '@app/core/models/due-out-material-model';
import { StyleMasterModel } from '@app/core/models/style-master-model';
import { LocalDataSource } from 'ng2-smart-table';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { DueOutMaterialDetailModel } from '@app/core/models/due-out-material-detail.model';
import { MaterialMasterService } from '@app/core/services/features.services/material-master-service';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import { CustomRenderSmartTableDueOutMaterialCheckboxComponent } from './due-out-material-checkbox-editor.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomRenderSmartTableDueOutMaterialInputComponent } from './due-out-material-input-editor.component';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'sa-due-out-material',
  templateUrl: './due-out-material.component.html',
  styleUrls: ['../../../../assets/css/common_extra.css', '../../../../assets/css/smart-table.scss', "./due-out-material.component.css"],
  entryComponents: [CustomRenderSmartTableDueOutMaterialCheckboxComponent, CustomRenderSmartTableDueOutMaterialInputComponent]
})
export class DueOutMaterialComponent extends BasePage implements OnInit {
  userLogin: any;
  isEdit: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  detailInfo: DueOutMaterialModel;
  detailDataTable: DueOutMaterialDetailModel[] = [];
  dateTimeNow: string;
  locations: GeneralMasterModel[] = [];
  locationsMid: any[] = [];
  processesMid: any[] = [];
  processes: GeneralMasterModel[] = [];
  _searchWorkOrderModalRef: BsModalRef;
  buyers: any = [];
  brands: any = [];
  sampSteps: any = [];
  itemizeds: any = [];
  materials: any = [];
  traderList: any = [];
  listWoMaterialHeader: any;
  listWOMaterial: any = [];
  orderType: any;
  styleName: any;
  buyerName: any;
  stepSeq: number;
  modelTable: DueOutMaterialTableModel[] = [];
  stockUnitIdvalue: any;
  stockUnits: any = [];
  constructions: any = [];
  colors: any = [];
  currents: any = [];

  @ViewChild("popupSearchWorkOrder") popupSearchWorkOrder;

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
    { name: "To Factory", value: true },
    { name: "Oursourcing(Enable Price)", value: false }
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
  objDeleteHeader = {
    companyId: 0,
    dueOutNo: 0
  }
  objDeleteDetail = {
    companyId: 0,
    dueOutNo: 0,
    materialCd: 0,
  }

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
    private dueOutMaterialService: DueOutMaterialService,
    private workOrderMasterService: WorkOrderMasterService,
    private materialMasterService: MaterialMasterService,
    private globalMasterService: GlobalMasterService,
    private _sanitizer: DomSanitizer,
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
    },
    // Messages for form validation
    messages: {
      styleNo: {
        required: 'Please select'
      },
    }
  };
  settingsDueOutMaterialComponent: any = {
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
    this.settingsDueOutMaterialComponent = {
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
        no: {
          title: 'No',
          type: 'text',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        ck: {
          title: this.i18nService.getTranslation('CK'),
          class: 'center',
          filter: false,
          type: 'string',
          editable: true,
          editor: { type: 'custom', component: CustomRenderSmartTableDueOutMaterialCheckboxComponent },
          // valuePrepareFunction: (value, row) => {
          //   console.log("Gia tri cua ck",value);
          //   let cbkHtml = value ? '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox" attr-id="' + row.no + '"  checked </input><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox"  attr-id="' + row.no + '" ></input><i></i></label>';
          //   return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          // }
          valuePrepareFunction: (value, row) => {
            console.log("Gia tri cua ck",value);
            let cbkHtml = value ? '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox" attr-id="' + row.no + '"  checked  /><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" class="single-checkbox"  attr-id="' + row.no + '"  /><i></i></label>';
            return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          }
        },

        itemizedGenCd: {
          title: this.i18nService.getTranslation('ITEMIZED'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            var itemizedGenCdName = this.itemizeds.find(p => p.gen_cd == row.itemizedGenCd);
            return itemizedGenCdName.gen_nm;
          }
        },
        materialCd: {
          title: this.i18nService.getTranslation('MATERIAL_NAME'),
          class: 'center',
          filter: false,
          type: 'string',
          editable: false,
          valuePrepareFunction: (cell, row) => {
            var itemizedGenCdName = this.materials.find(p => p.gen_cd == row.materialSeq);
            this.stockUnitIdvalue = itemizedGenCdName.stockUnitGenCd;
            return itemizedGenCdName.materialDsplNm;
          }
        },
        dueOutNo: {
          title: this.i18nService.getTranslation('CODE'),
          type: 'text',
          class: "left",
          editable: true,
          filter: false,
        },
        unit: {
          title: this.i18nService.getTranslation('UNIT'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          valuePrepareFunction: (cell, row) => {
            var bizUnitName = this.stockUnits.find(p => p.gen_cd == this.stockUnitIdvalue);
            return bizUnitName.gen_nm;
          }

        },
        constructionGenCd: {
          title: this.i18nService.getTranslation('CONSTRUCTION'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            var constructionsName = this.constructions.find(p => p.gen_cd == row.constructionGenCd);
            return constructionsName.gen_nm;
          }
        },
        colorIdMaterial: {
          title: this.i18nService.getTranslation('COLOR'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            var colorName = this.colors.find(p => p.colorId == row.colorIdMaterial);
            return colorName.colorName;
          }
        },
        totalYield: {
          title: this.i18nService.getTranslation('YIELD'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
        },
        needQty: {
          title: this.i18nService.getTranslation('NEED'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
        },
        currentQty: {
          title: this.i18nService.getTranslation('CURRENT'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
        },
        dueOutQty: {
          title: this.i18nService.getTranslation('DUE_OUT'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
          editor: { type: 'custom', component: CustomRenderSmartTableDueOutMaterialInputComponent },
        },
        balanceQty: {
          title: this.i18nService.getTranslation('BALANCE'),
          type: 'html',
          class: 'center',
          filter: false,
          editable: false,
        },
        remark: {
          title: this.i18nService.getTranslation('DESCRIPTION'),
          type: 'html',
          class: 'center',
          filter: false,
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
    var self = this;
    self.detailInfo = new DueOutMaterialModel();
    this.dateTimeNow = new Date().toString('yyyy.MM.dd');
    this.detailInfo.companyId = this.companyInfo.company_id;
    this.initApprovalComponentDatatable();
    this.loadBrand();
    return Promise.all([
      this.getLocationList(),
      this.getProcessList(),
      this.getAllTrader(),
      this.getSampStepList(),
      this.getItemized(),
      this.getMaterialName(),
      this.getStockUnit(),
      this.getConstruction(),
      this.getCurrentStock(),
      this.getStyleColor(),
    ]).then(res => {
      this.locations.push(...res[0]);
      this.processes.push(...res[1]);
      this.traderList.push(...res[2]);
      this.sampSteps.push(...res[3]);
      this.itemizeds.push(...res[4]);
      this.materials.push(...res[5]);
      this.stockUnits.push(...res[6]);
      this.constructions.push(...res[7]);
      this.currents.push(...res[8]);
      this.buyers = _.filter(self.traderList, function (item) {
        return (item.type_gen_cd + '') === '170100110000';
      });
      this.locationsMid = _.clone(this.locations);
      this.processesMid = _.clone(this.processes);
    });
  }
  showSearchWorkOrderPopup() {
    this._searchWorkOrderModalRef = this.modalService.show(this.popupSearchWorkOrder, this.modelConfig);
  }
  closeSearchWorkOrderPopup() {
    this._searchWorkOrderModalRef && this._searchWorkOrderModalRef.hide();
  }

  onReset() {
    $("form.frm-due-out-material-detail").validate().resetForm();
    this.detailInfo = new DueOutMaterialModel();
    this.dueOutMaterialService.storeDueOutMaterialModel(this.detailInfo);
    this.entryData.date = moment().format('YYYY.MM.DD');
    this.entryData.user = this.loggedUser.user_name;
    this.source = new LocalDataSource();
    this.modelTable = [];
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
  onChangeDueOutType(value) {
    var self = this;
    if (value == "true") {
      this.locations = this.locationsMid;
      this.processes = this.processesMid;
      this.locations = this.locations.filter(p => p.ck_value_1 == null)
      this.detailInfo.workPlaceValue = self.locations[0].gen_cd;
      this.processes = this.processes.filter(p => p.ck_value_1 == null)
      this.detailInfo.processGenCd = self.processes[0].gen_cd;
    } else {
      this.locations = this.locationsMid;
      this.processes = this.processesMid;
    }
  }
  private getLocationList() {
    return this.dueOutMaterialService.listGeneralType(Category.Location.valueOf());
  }
  private getProcessList() {
    return this.dueOutMaterialService.listGeneralType(Category.Process.valueOf());
  }
  private getAllTrader() {
    return this.traderService.ListTrader(this.companyInfo.company_id);
  }
  private getSampStepList() {
    return this.generalMasterService.listGeneralByCate(Category.SampleStep.valueOf());
  }
  private getItemized() {
    return this.generalMasterService.listGeneralItemizedByMaterial();
  }
  private getMaterialName() {
    return this.materialMasterService.listMaterialMasterAll();
  }
  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }
  private getConstruction() {
    return this.generalMasterService.listGeneralByCate(Category.Contruction.valueOf());
  }
  private getStyleColor() {
    return this.styleMasterService.getListStyleMasterColor().then(data => this.colors.push(...data.data));
  }
  private getCurrentStock() {
    return this.dueOutMaterialService.currentStock();
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
  private loadDataMaterialHeader() {
    this.workOrderMasterService.getWorkOrderById(this.detailInfo.woNo, this.stepSeq).then(data => {
      this.listWoMaterialHeader = data.data;
    });
  }
  private loadDataMaterial() {
    this.workOrderMasterService.getWorkOrderMaterialById(this.detailInfo.woNo, this.stepSeq).then(data => this.listWOMaterial.push(...data));
  }
  loadToTable() {
    this.source = new LocalDataSource();
    this.modelTable = [];
    this.listWOMaterial = [];
    this.detailInfo.companyId = this.companyInfo.company_id;
    this.loadDataMaterialHeader();
    this.loadDataMaterial();
    setTimeout(() => {
      console.log("Gia tri cua this.detailInfo", this.detailInfo)
      console.log("Gia tri cua listWoMaterialHeader", this.listWoMaterialHeader);
      console.log("Gia tri cua listWOMaterial", this.listWOMaterial);
      console.log("Gia tri cua itemizeds", this.itemizeds)
      console.log("Gia tri cua materials", this.materials)
      console.log("Gia tri cua coclor", this.colors)
      console.log("Gia tri cua currents", this.currents)
      let i: number = 1;
      let fixData = new DueOutMaterialTableModel();
      this.listWOMaterial.forEach(item => {
        fixData.no = i++;
        fixData.materialCd = item.materialCd;
        fixData.dueOutNo = item.materialCd;
        fixData.itemizedGenCd = item.itemizedGenCd;
        fixData.constructionGenCd = item.constructionGenCd;
        fixData.colorIdMaterial = item.colorIdStyle;
        fixData.totalYield = item.totalYield;
        fixData.needQty = (Number(item.totalYield) * Number(this.detailInfo.workQty)).toFixed(2);
        let a = this.currents.find(p => p.companyId == this.detailInfo.companyId && p.itemCd == fixData.materialCd && p.locationNo == "412000000000");
        if (a) {
          fixData.currentQty = a.currentStock
        }
        else {
          fixData.currentQty = 0
        }
        fixData.ck = false;
        this.modelTable.push(fixData);
        fixData = new DueOutMaterialTableModel();
      });
      this.source = new LocalDataSource(this.modelTable);
    }, 300);
  }

  selectWorkOrder(item) {
    this.detailInfo.woNo = item.selected.woNo;
    this.detailInfo.styleNo = item.selected.styleNo;
    this.detailInfo.workQty = item.selected.orderQty;
    this.detailInfo.buyerCd = item.selected.buyer;
    this.orderType = item.orderType === true ? "Sample" : "Main";
    this.buyerName = this.buyers.find(p => p.trader_id === item.selected.buyer).trader_local_nm;
    this.detailInfo.stepSeq = item.selected.stepSeq;
    this.stepSeq = item.selected.stepSeq;
  }
  onPrice() {
    let workQty = Number(this.detailInfo.workQty);
    let priceVal = Number(this.detailInfo.price);
    this.detailInfo.amount = workQty * priceVal;
  }
  onDelete() {
    this.objDeleteHeader.companyId = this.detailInfo.companyId;
    this.objDeleteHeader.dueOutNo = this.detailInfo.dueOutNo;

    this.dueOutMaterialService.deleteDueOutMaterialHeader(this.objDeleteHeader).then(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.message);
      } else {
        this.notification.showMessage("success", data.message);
        // --------------Xoa detail-----cui mia-------
        this.source.getAll().then((data) => {
          data.forEach(item => {
            this.objDeleteDetail.companyId = this.detailInfo.companyId;
            this.objDeleteDetail.dueOutNo = this.detailInfo.dueOutNo;
            this.objDeleteDetail.materialCd = item.materialCd;
            this.dueOutMaterialService.deleteDueOutMaterialDetail(this.objDeleteDetail).then(data => {
              if (!data.success) {
                this.notification.showMessage("error", data.message);
              } else {
                this.notification.showMessage("success", data.message);
                this.onReset();
              }
            });

          });
        });
        // --------------Xoa detail-----pro-------
      }
    });
  }
  onSaveConfirm(event) {
    event.confirm.resolve(event.newData);
    let a: any[] = [];
    a.push(event.newData);
    let detailData = new DueOutMaterialDetailModel();
    a.forEach(item => {
      detailData.dueOutNo = this.detailInfo.dueOutNo;
      detailData.companyId = this.detailInfo.companyId;
      detailData.materialCd = item.materialCd;
      detailData.itemizedGenCd = item.itemizedGenCd;
      detailData.colorIdMaterial = item.colorIdMaterial;
      detailData.constructionGenCd = item.constructionGenCd;
      detailData.totalYield = item.totalYield;
      detailData.needQty = parseFloat(item.needQty);
      detailData.currentQty = parseFloat(item.currentQty);
      detailData.dueOutQty = parseFloat(item.dueOutQty);
      detailData.balanceQty = parseFloat(item.balanceQty);
      detailData.remark = item.remark;
      this.detailDataTable.push(detailData);
      detailData = new DueOutMaterialDetailModel();
    });
  }

  private loadTableAfterInsert(model) {
    this.dueOutMaterialService.getDueOutMaterialDetail(model).then(data => {
      if (!data.success) {
      } else {
        this.source = new LocalDataSource();
        this.source = new LocalDataSource(data);
      }
    });
  }
  onSubmit() {
    this.detailInfo.companyId = this.companyInfo.company_id;
    this.detailInfo.eta = moment(this.detailInfo.eta).format('YYYY-MM-DD');
    this.detailInfo.createdTime = new Date().toString('yyyy-MM-dd');
    this.detailInfo.styleSysId = this.listWoMaterialHeader.styleSysId;
    console.log("Gia tri cua this.detail", this.detailInfo);
    if (this.detailInfo.dueOutNo === 0) {
      this.dueOutMaterialService.insertDueOutMaterialHeader(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.detailInfo.dueOutNo = data.data.dueOutNo;
          this.detailDataTable.forEach(item => {
            item.dueOutNo = this.detailInfo.dueOutNo;
            item.createdTime = new Date().toString('yyyy-MM-dd');
          });
          console.log("Gia tri cua this.detail", this.detailDataTable);
          for (let i = 0; i < this.detailDataTable.length; i++) {
            this.dueOutMaterialService.insertDueOutMaterialDetail(this.detailDataTable[i]).then(data => {
              if (!data.success) {
                this.notification.showMessage("error", data.message);
              } else {
                this.notification.showMessage("success", data.message);

              }
            });
          }
          setTimeout(() => {
            this.loadTableAfterInsert({ dueOutNo: this.detailInfo.dueOutNo });
            this.detailDataTable = [];
          }, 300);

        }
      });
    }
    else {
      this.dueOutMaterialService.updateDueOutMaterialHeader(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.detailInfo.dueOutNo = data.data.dueOutNo;

          this.detailDataTable.forEach(item => {
            item.dueOutNo = this.detailInfo.dueOutNo;
            item.createdTime = new Date().toString('yyyy-MM-dd');
          });
          console.log("Gia tri cua this.detail update", this.detailDataTable);
          for (let i = 0; i < this.detailDataTable.length; i++) {
            this.dueOutMaterialService.insertDueOutMaterialDetail(this.detailDataTable[i]).then(data => {
              if (!data.success) {
                this.notification.showMessage("error", data.message);
              } else {
                this.notification.showMessage("success", data.message);
              }
            });
          }
          setTimeout(() => {
            this.loadTableAfterInsert({ dueOutNo: this.detailInfo.dueOutNo });
            this.detailDataTable = [];
          }, 300);
        }
      });
    }
  }
}

