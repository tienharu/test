import { Component, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { ActivatedRoute } from '@angular/router';
import { StyleMasterModel } from '@app/core/models/style-master-model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { StyleMasterService } from "@app/core/services/features.services/style-master.service";
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import { StyleMasterBreakDownPopupComponent } from './popups/style-master-breakdown-popup/style-master-breakdown-popup.component';
import { StyleMasterRegistColorPopupComponent } from './popups/style-master-regist-color-popup/style-master-regist-color-popup.component';
import { StyleMasterRegistSwatchPopupComponent } from './popups/style-master-regist-swatch-popup/style-master-regist-swatch-popup.component';
import { StyleMasterRegistYieldPopupComponent } from './popups/style-master-regist-yield-popup/style-master-regist-yield-popup.component';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'sa-style-master',
  templateUrl: './style-master.component.html',
  styleUrls: ['../../../../assets/css/common_extra.css', '../../../../assets/css/smart-table.scss', "./style-master.component.css"],
  entryComponents: [StyleMasterBreakDownPopupComponent, StyleMasterRegistColorPopupComponent, StyleMasterRegistSwatchPopupComponent, StyleMasterRegistYieldPopupComponent]
})
export class StyleMasterComponent extends BasePage implements OnInit {
  @ViewChild("popupStyleMasterRegistColor") popupStyleMasterRegistColor;
  @ViewChild("popupStyleMasterRegistSwatch") popupStyleMasterRegistSwatch;
  @ViewChild("popupStyleMasterRegistYield") popupStyleMasterRegistYield;
  @ViewChild("popupStyleMasterPOBreakdown") popupStyleMasterPOBreakdown;
  @ViewChild("popupStyleMasterSearch") popupStyleMasterSearch;

  @ViewChild("rowTab") rowTab;
  @ViewChild("subTab") subTab;
  @ViewChild("poTab") poTab;

  _colorModalRef: BsModalRef;
  _swatchModalRef: BsModalRef;
  _yieldModalRef: BsModalRef;
  _poModalRef: BsModalRef;
  _searchModalRef: BsModalRef;
  //
  styleSysId: any = null;
  tab: number = 1;
  styleTypes: any = [];
  tradeTypes: any = [];
  styleCategories: any = [];
  traderList: any = [];
  vendors: any = [];
  statuses: any = [];
  buyers: any = [];
  brands: any = [];
  defaultVender: any;
  userLogin: any;
  styleHeader: StyleMasterModel;
  isEdit: boolean = false;
  isClosed: boolean = false;
  closedYmd: any;
  isCancelled: boolean = false;
  cancelledYmd: any;
  recvYmd: any;
  buyerCd: any = "";
  entryData = {
    date: '',
    user: ''
  }
  modelConfig: any = {
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private i18nService: I18nService,
    private generalMasterService: GeneralMasterService,
    private styleMasterService: StyleMasterService,
    private traderService: TraderService,
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
        required: true,
        digits: true
      },
      styleName: {
        required: true
      },
      buyerCd: {
        required: true
      },
      orderRecvYmd: {
        required: true
      },
      orderQty: {
        required: true,
      },
      price: {
        required: true,
      },
      amount: {
        required: true,
      },
      styleCategoryGenCd: {
        required: true
      },
      styleTypeGenCd: {
        required: true
      },
      brandGenCd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      styleNo: {
        required: "Please enter",
        digits: ""
      },
      styleName: {
        required: "Please enter"
      },
      orderRecvYmd: {
        required: "Please select"
      },
      orderQty: {
        required: "Please enter",
        digits: ""
      },
      price: {
        required: "Please enter",
        digits: ""
      },
      amount: {
        required: "Please enter",
        digits: ""
      },
      styleCategoryGenCd: {
        required: "Please select"
      },
      styleTypeGenCd: {
        required: "Please select"
      },
      buyerCd: {
        required: "Please select"
      },
      brandGenCd: {
        required: "Please select"
      }
    }
  };

  ngOnInit() {
    var self = this;
    this.checkPermission(ProgramList.Style_Master.valueOf());
    self.styleSysId = null; //this.route.snapshot.paramMap.get("id") || null; 
    self.styleHeader = new StyleMasterModel();
    self.userLogin = self.loggedUser;
    self.loadCommonData().then(function () {
      self.vendors = _.filter(self.traderList, function (item) {
        return (item.type_gen_cd + '') === '170100120000';
      });
      self.buyers = _.filter(self.traderList, function (item) {
        return (item.type_gen_cd + '') === '170100110000';
      });
      self.initModel();
      // if (self.styleSysId && self.styleSysId !== '0') {
      //   self.isEdit = true;
      //   setTimeout(function () {
      //     return self.loadStyleInfo(self.styleSysId);
      //   }, 500);
      // } else {
      //   self.isEdit = false;
      // }
      // $(window.parent.document).find(".center-loading").hide();
    });
  }

  initModel() {
    var self = this;
    if (self.defaultVender && !self.styleHeader.venderCd) {
      self.styleHeader.venderCd = self.defaultVender.number_value_1;
    }

    self.closedYmd = self.styleHeader.closedYmd ? moment(self.styleHeader.closedYmd).format('YYYY.MM.DD') : null;
    self.cancelledYmd = self.styleHeader.cancelYmd ? moment(self.styleHeader.closedYmd).format('YYYY.MM.DD') : null;
    self.recvYmd = self.styleHeader.orderRecvYmd ? moment(self.styleHeader.orderRecvYmd).format('YYYY.MM.DD') : null;

    self.isClosed = self.closedYmd !== null;
    self.isCancelled = self.cancelledYmd !== null;

    self.entryData.user = self.styleHeader.creator || self.loggedUser.user_name || null;
    if (self.styleHeader.createdTime) {
      self.entryData.date = moment(_.clone(self.styleHeader.createdTime)).format('YYYY.MM.DD');
    }
    // if (self.styleHeader.createdTime) {
    //   self.entryData.date = moment(_.clone(self.styleHeader.createdTime)).format('YYYY.MM.DD');
    // }
    if (self.styleHeader.buyerCd) {
      self.buyerCd = self.styleHeader.buyerCd + "";
    }

    self.calPriceAmount();
  }

  ngAfterViewInit() {
    $('b[role="presentation"]').hide();
    $('.select2-selection__arrow').append('<i class="fa fa-angle-down" style="select2-selection__arrow"></i>');
  }

  onSubmit() {
    var self = this;
    self.notification.showCenterLoading();
    const _invalid = $("form.frm-style-detail").valid();
    if (!_invalid) {
      this.notification.hideCenterLoading();
      return;
    }
    self.styleHeader.closedYmd = self.closedYmd ? self.closedYmd : null;
    self.styleHeader.cancelYmd = self.cancelledYmd ? self.cancelledYmd : null;
    self.styleHeader.orderRecvYmd = self.recvYmd ? self.recvYmd : null;
    self.styleHeader.buyerCd = parseInt(self.buyerCd);

    var data = _.clone(self.styleHeader);
    var req;
    if (self.isEdit) {
      req = self.styleMasterService.updateStyle(data);
    } else {
      req = self.styleMasterService.insertStyle(data);
    }
    return req.then(rs => {
      self.notification.hideCenterLoading();
      if (rs.success) {
        self.notification.showSuccess(data.message || 'Add style successfully!');
        var result = rs.data;
        if (!self.styleSysId) {
          self.styleSysId = result.styleSysId;
          // self.replaceIframeDetail(self.styleSysId);
          self.isEdit = true;
        }
        self.styleMasterService.storeStyleMasterModel(result);
        self.styleHeader = result;
        self.initModel();
      }
    });
  }

  replaceIframeDetail(styleSysId) {
    var $page = $(window.parent.document).find("#page");
    var $iframe = $page.find("iframe[id=" + ProgramList.Style_Master.valueOf() + "]");
    if ($iframe.length) {
      $iframe.attr('src', '/#/style-master/' + styleSysId);
      this.programService.resetProgramUrl('/style-master/' + styleSysId);
    }
  }

  onReset() {
    var self = this;
    $("form.frm-style-detail").validate().resetForm();
    self.styleHeader = new StyleMasterModel();
    self.styleMasterService.storeStyleMasterModel(self.styleHeader);
    self.styleSysId = null;
    self.isEdit = false;
    self.buyerCd = "";
    self.tab = 1;
    // self.replaceIframeDetail(self.styleSysId);
    self.initModel();
    if (self.tab === 1) {
      self.rowTab.ngOnInit();
    }
    if (self.tab === 2) {
      self.subTab.ngOnInit();
    }
    if (self.tab === 3) {
      self.poTab.ngOnInit();
    }
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onCheckClosedOrCancelled(type) {
    if (type === 'closed') {
    }
  }

  showRegistColorPopup() {
    this._colorModalRef = this.modalService.show(this.popupStyleMasterRegistColor, this.modelConfig);
  }

  showRegistSwatchPopup() {
    this._swatchModalRef = this.modalService.show(this.popupStyleMasterRegistSwatch, this.modelConfig);
  }

  showRegistYieldPopup() {
    this._yieldModalRef = this.modalService.show(this.popupStyleMasterRegistYield, this.modelConfig);
  }

  showPOBreakdownPopup() {
    this._poModalRef = this.modalService.show(this.popupStyleMasterPOBreakdown, this.modelConfig);
  }

  showSearchStylePopup() {
    this._searchModalRef = this.modalService.show(this.popupStyleMasterSearch, this.modelConfig);
  }

  closeRegistColorPopup() {
    this._colorModalRef && this._colorModalRef.hide();
  }

  closeRegistSwatchPopup() {
    this._swatchModalRef && this._swatchModalRef.hide();
  }

  closeRegistYieldPopup() {
    this._yieldModalRef && this._yieldModalRef.hide();
  }

  closePOBreakdownPopup() {
    this._poModalRef && this._poModalRef.hide();
  }

  closeSearchStylePopup() {
    this._searchModalRef && this._searchModalRef.hide();
  }

  selectStyle(item) {
    var self = this;
    self.notification.showCenterLoading();
    if (!item) {
      self.isEdit = false;
      self.notification.hideCenterLoading();
      return;
    }
    self.styleSysId = item.styleSysId;
    self.tab = 1;
    if (self.styleSysId) {
      self.isEdit = true;
      return self.loadStyleInfo(self.styleSysId).then(function () {
        self.notification.hideCenterLoading();
        if (self.tab === 1) {
          self.rowTab.ngOnInit();
        }
        if (self.tab === 2) {
          self.subTab.ngOnInit();
        }
        if (self.tab === 3) {
          self.poTab.ngOnInit();
        }
      });
    }
  }

  reloadData(event) {
    var self = this;
    if (event === 'reload-regist-color-data') {
      if (self.tab === 1) {
        self.rowTab.reloadRegistColorData();
      }
      if (self.tab === 2) {
        self.subTab.reloadRegistColorData();
      }
    }
    if (event === 'reload-regist-yield-data') {
      if (self.tab === 1) {
        self.rowTab.reloadRegistYieldData();
      }
      if (self.tab === 2) {
        self.subTab.reloadRegistYieldData();
      }
    }
  }

  onCheckClosed() {
    $("input[name='closedYmd']").parent().removeClass('state-error');
    $("input[name='closedYmd']").parent().find('em').remove();
    if (this.isClosed) {
      this.closedYmd = this.styleHeader.closedYmd ? moment(this.styleHeader.closedYmd).format('YYYY.MM.DD') : "";
      $("input[name='closedYmd']").rules('add', 'required');
    } else {
      this.closedYmd = "";
      $("input[name='closedYmd']").rules('remove');
    }
  }

  onCheckCancelled() {
    $("input[name='cancelYmd']").parent().removeClass('state-error');
    $("input[name='cancelYmd']").parent().find('em').remove();
    if (this.isCancelled) {
      this.cancelledYmd = this.styleHeader.cancelYmd ? moment(this.styleHeader.cancelYmd).format('YYYY.MM.DD') : "";
      $("input[name='cancelYmd']").rules('add', 'required');
    } else {
      this.cancelledYmd = "";
      $("input[name='cancelYmd']").rules('remove');
    }
  }

  setSelectionRange(e) {
    e.target.select();
  }

  calPriceAmount() {
    this.styleHeader.amount = CommonFunction.FormatCurrency(this.styleHeader.orderQty) * CommonFunction.FormatCurrency(this.styleHeader.price);
  }

  private loadCommonData() {
    return Promise.all([this.getStyleCategories(), this.getStyleTypes(), this.getTradeType(), this.getAllTrader(), this.getDefaultVender(), this.getStyleBrands()]);
  }

  private getStyleCategories() {
    return this.generalMasterService.listGeneralByCate(Category.StyleCategory.valueOf()).then(data => this.styleCategories.push(...data));
  }

  private getStyleTypes() {
    return this.generalMasterService.listGeneralByCate(Category.StyleType.valueOf()).then(data => this.styleTypes.push(...data));
  }

  private getTradeType() {
    return this.generalMasterService.listGeneralByCate(Category.TradeTypeCateCode.valueOf()).then(data => this.tradeTypes.push(...data));
  }

  private getAllTrader() {
    return this.traderService.ListTrader(this.companyInfo.company_id).then(data => this.traderList.push(...data));
  }

  private getDefaultVender() {
    return this.generalMasterService.listGeneralByCate(Category.DefaultVender.valueOf()).then(data => {
      if (data && data.length) {
        this.defaultVender = data[0] || null;
      }
    });
  }

  private getStyleBrands() {
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

  private loadStyleInfo(styleSysId) {
    var self = this;
    return this.styleMasterService.getStyleById(styleSysId).then(function (rs: any) {
      if (!rs.success) {
        self.notification.showMessage('error', 'This style not existed. Please choose another one.');
        return;
      }
      self.styleMasterService.storeStyleMasterModel(rs.data);
      self.styleHeader = _.clone(rs.data);
      self.initModel();
    });
  }
}

