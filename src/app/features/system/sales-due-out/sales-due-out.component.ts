import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { ActivatedRoute } from '@angular/router';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
// import { DueOutMaterialService } from '@app/core/services/features.services/due-out-material.service';
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';
import * as moment from 'moment';
import _ from 'lodash';
// import { DueOutMaterialModel, DueOutMaterialTableModel } from '@app/core/models/due-out-material-model';
import { StyleMasterModel } from '@app/core/models/style-master-model';
import { LocalDataSource } from 'ng2-smart-table';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
// import { DueOutMaterialDetailModel } from '@app/core/models/due-out-material-detail.model';
import { MaterialMasterService } from '@app/core/services/features.services/material-master-service';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';

@Component({
  selector: 'sa-sales-due-out',
  templateUrl: './sales-due-out.component.html',
  styleUrls: ['../../../../assets/css/common_extra.css', '../../../../assets/css/smart-table.scss', "./sales-due-out.component.css"],
  entryComponents: []
})
export class SalesDueOutComponent extends BasePage implements OnInit {
  userLogin: any;
  isEdit: boolean = false;
  source: LocalDataSource = new LocalDataSource();
  // detailInfo: DueOutMaterialModel;
  dateTimeNow: string;
  locations: GeneralMasterModel[] = [];
  locationsMid: any[] = [];
  processesMid: any[] = [];
  processes: GeneralMasterModel[] = [];
  _searchWorkOrderModalRef: BsModalRef;
  buyers: any = [];
  brands: any = [];
  sampSteps: any = [];
  itemizeds : any = [];
  materials : any = [];
  traderList: any = [];
  listWoMaterialHeader : any;
  listWOMaterial : any = [];
  orderType : any;
  styleName :  any;
  buyerName : any;
  stepSeq : number;
  // modelTable : DueOutMaterialDetailModel[] = [];
  stockUnitIdvalue : any;
  stockUnits : any = [];
  constructions : any = [];
  colors : any = [];

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
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    private generalMasterService: GeneralMasterService,
    private traderService: TraderService,
    private styleMasterService: StyleMasterService,
    // private dueOutMaterialService: DueOutMaterialService,
    private workOrderMasterService: WorkOrderMasterService,
    private materialMasterService: MaterialMasterService,
    private globalMasterService: GlobalMasterService,
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
        add: false,
        columnTitle: ''
      },
      // hideSubHeader: !isEdit,
      delete: {
        confirmDelete: true,
        deleteButtonContent: 'Delete',
        class: 'center',
      },
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
        no: {
          title: 'No',
          type: 'text',
          class: 'center',
          filter: false,
          editable: false,
          addable: false,
        },
        colorName: {
          title: this.i18nService.getTranslation('ITEMIZED'),
          type: 'string',
          class: 'center',
          // editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            var itemizedGenCdName = this.itemizeds.find(p=>p.gen_cd == row.itemizedGenCd);
            return itemizedGenCdName.gen_nm;
          }
        },
        size: {
          title: this.i18nService.getTranslation('MATERIAL_NAME'),
          class: 'center',
          filter: false,
          type: 'string',
          editable: false,
          valuePrepareFunction: (cell, row) => {
            var itemizedGenCdName = this.materials.find(p=>p.gen_cd == row.materialSeq);
            this.stockUnitIdvalue = itemizedGenCdName.stockUnitGenCd;
            //row.unit = itemizedGenCdName.bizUnitId;
            console.log("biz",itemizedGenCdName.stockUnitGenCd)
            return itemizedGenCdName.materialDsplNm;
          }
        },
        Order: {
          title: this.i18nService.getTranslation('CODE'),
          type: 'text',
          class: "left",
          editable: false,
          filter: false,
          // editor: { type: 'custom', component: ApprovalLineRegiatrationComponent },
          // valuePrepareFunction: (cell, row) => {
          //   var mainApprovalName = this.listSysUser.find(p=>p.user_id == row.mainapproverid);
          //   return mainApprovalName.user_nm;
          // }
        },
        finished: {
          title: this.i18nService.getTranslation('UNIT'),
          type: 'html',
          class: 'center',
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            var bizUnitName = this.stockUnits.find(p=>p.gen_cd == this.stockUnitIdvalue);
            return bizUnitName.gen_nm;
          }

        },
        dueOyt: {
          title: this.i18nService.getTranslation('CONSTRUCTION'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          // valuePrepareFunction: (cell, row) => {
          //   var constructionsName = this.constructions.find(p=>p.gen_cd == row.constructionGenCd);
          //   return constructionsName.gen_nm;
          // }
        },
        remain: {
        title: this.i18nService.getTranslation('COLOR'),
        type: 'string',
        class: 'center',
        editable: false,
        filter: false,
        // valuePrepareFunction: (cell, row) => {
        //   var colorName = this.colors.find(p=>p.colorId == row.colorIdMaterial);
        //   return colorName.colorName;
        // }
        },
        price: {
          title: this.i18nService.getTranslation('STOCK'),
          type: 'html',
          class: 'center',
          filter: false,
          addable: false,
          // valuePrepareFunction: (cell, row) => {
          //   var ApprovalGenSubPossition = this.positions.find(p=>p.gen_cd == row.subapproverpositiongid);
          //   return ApprovalGenSubPossition.gen_nm;
          // }
        },
        amount: {
          title: this.i18nService.getTranslation('YEILD'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          //   editor: {
          //     type: 'list',
          //     config: {
          //       selectText: 'Select',
          //       list: this.listInOut
          //     },
          //   },
          //   valuePrepareFunction: (value) => {
          //     let mps = value == '1' ? 'In' : value == 1 ? 'In':'Out';
          //     return mps;
          //   },
          // },
        },
        remark: {
          title: this.i18nService.getTranslation('INPUT'),
          type: 'html',
          class: 'center',
          filter: false,
          addable: false,
          editable: true,
          // valuePrepareFunction: (cell, row) => {
          //   var ApprovalGenSubPossition = this.positions.find(p=>p.gen_cd == row.subapproverpositiongid);
          //   return ApprovalGenSubPossition.gen_nm;
          // }
        }
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header transaction-component-table'
      },
    }
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    // var self = this;
    // self.detailInfo = new DueOutMaterialModel();
    // this.dateTimeNow = new Date().toString('yyyy.MM.dd');
    this.initApprovalComponentDatatable();
    this.loadBrand();
    this.getSampStepList();
    this.getAllTrader().then(rs => {
      this.traderList.push(rs);
      this.buyers = _.filter(this.traderList, function (item) {
        return (item.type_gen_cd + '') === '170100110000';
      });
    })
    this.getLocationList().then(rs => this.locations.push(...rs));
    this.getProcessList().then(rs => this.processes.push(...rs));
    console.log("buyerrr", this.buyers);
    setTimeout(function () {
      $('ng2-smart-table table.transaction-component-table thead .ng2-smart-titles').css("display", "none");
      $('ng2-smart-table table.transaction-component-table thead').prepend('<tr class="ng2-smart-titles-custom-1"><th id="custom-th1">Color</th><th id="custom-th2">Size</th><th id="custom-th3">Order</th><th id="custom-th3">Finished</th><th id="custom-th3">Due Out</th><th id="custom-th3">Remain</th><th id="custom-th3">Price</th><th id="custom-th3">Amount</th></tr>');
      $('ng2-smart-table table.transaction-component-table thead').prepend('<tr class="ng2-smart-titles-custom"><th rowspan="2">No</th><th colspan="2" >Order</th><th colspan="4">Quantity</th><th colspan="2" >Sales Amount</th><th rowspan="2" >Description</th></tr>');
    }, 200);
    // return Promise.all([
    //   this.getLocationList(),
    //   this.getProcessList(),
    //   this.getAllTrader(),
    //   this.getSampStepList(),
    //   this.getItemized(),
    //   this.getMaterialName(),
    //   this.getStockUnit(),
    //   this.getConstruction(),
    //   this.getStyleColor(),
    // ]).then(res => {
    //   this.locations.push(...res[0]);
    //   this.processes.push(...res[1]);
    //   this.traderList.push(...res[2]);
    //   this.sampSteps.push(...res[3]);
    //   this.itemizeds.push(...res[4]);
    //   this.materials.push(...res[5]);
    //   this.stockUnits.push(...res[6]);
    //   this.constructions.push(...res[7]);
    //   this.buyers = _.filter(self.traderList, function (item) {
    //     return (item.type_gen_cd + '') === '170100110000';

    //   });
    //   this.locationsMid = _.clone(this.locations);
    //   this.processesMid = _.clone(this.processes);
    // });
  }
  showSearchWorkOrderPopup() {
    this._searchWorkOrderModalRef = this.modalService.show(this.popupSearchWorkOrder, this.modelConfig);
  }
  closeSearchWorkOrderPopup() {
    this._searchWorkOrderModalRef && this._searchWorkOrderModalRef.hide();
  }

  onSubmit() {
    var self = this;
    self.notification.showCenterLoading();
    const _invalid = $("form.frm-due-out-material-detail").valid();
    if (!_invalid) {
      this.notification.hideCenterLoading();
      return;
    }
  }

  onReset() {
  //   $("form.frm-due-out-material-detail").validate().resetForm();
  //   this.detailInfo = new DueOutMaterialModel();
  //   this.dueOutMaterialService.storeDueOutMaterialModel(this.detailInfo);
  //   // this.isEdit = false;
  //   this.entryData.date = moment().format('YYYY.MM.DD');
  //   this.entryData.user = this.loggedUser.user_name;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  private loadCommonData() {
    return Promise.all([]);
  }
  onChangeDueOutType(value) {
    var self = this;
    if (Number(value) === 1) {
      self.locations = self.locations.splice(1);
      self.processes = self.processes.filter(p => p.ck_value_1 == null)
    } else {
      self.locations = this.locationsMid;
      self.processes = this.processesMid;
    }
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
  private loadBrand() {
    return this.styleMasterService.getStyleBrand().then(rs => {
      console.log("Gia tri cua rs", rs);
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
  // private loadDataMaterialHeader(){
  //    this.workOrderMasterService.getWorkOrderById(this.detailInfo.woNo, this.stepSeq).then(data => {
  //      this.listWoMaterialHeader = data;
  //    });
  // }
  // private loadDataMaterial(){
  //   return this.workOrderMasterService.getWorkOrderMaterialById(this.detailInfo.woNo, this.stepSeq).then(data => this.listWOMaterial.push(...data));
  // }
  // loadToTable(){
  //   this.loadDataMaterialHeader();
  //   this.loadDataMaterial();
  //   setTimeout(() => {
  //     console.log("Gia tri cua listWoMaterialHeader",this.listWoMaterialHeader);
  //     console.log("Gia tri cua listWOMaterial",this.listWOMaterial);
  //     console.log("Gia tri cua itemizeds",this.itemizeds)
  //     console.log("Gia tri cua materials",this.materials)
  //     console.log("Gia tri cua coclor",this.colors)
  //     let fixData = new DueOutMaterialDetailModel();
  //     this.listWOMaterial.forEach(item => {
  //       fixData.materialCd = item.materialCd;
  //       fixData.itemizedGenCd = item.itemizedGenCd;
  //       fixData.constructionGenCd = item.constructionGenCd;
  //       fixData.colorIdMaterial = item.colorIdStyle;
  //       fixData.totalYield = item.totalYield;
  //       fixData.needQty = item.needQty;
  //       fixData.currentQty = "500";
  //       this.modelTable.push(fixData);
  //       fixData = new DueOutMaterialDetailModel();
  //     });
  //     this.source = new LocalDataSource(this.modelTable);
  //   },300);
   

  // }

  // selectWorkOrder(item) {
  //   console.log("Gia tri cua item", item)
  //   this.detailInfo.woNo = item.selected.woNo;
  //   this.detailInfo.styleNo = item.selected.styleNo;
  //   this.detailInfo.buyerCd = item.selected.buyer;
  //   this.orderType = item.orderType  === true? "Sample" : "Main" ;
  //   console.log("Gia tri cua Buyer",this.buyers);
  //   this.buyerName = this.buyers.find(p =>p.trader_id === item.selected.buyer).trader_local_nm;
  //   this.stepSeq = item.selected.stepSeq;
  // }
 

}

