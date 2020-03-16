import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ɵConsole } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category} from '@app/core/common/static.enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CommonFunction } from '@app/core/common/common-function';
import { LocalDataSource } from "ng2-smart-table/lib/data-source/local/local.data-source";
import { StyleMasterYieldModel } from '@app/core/models/style-master-yield-model';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { CustomRenderSmartTableStyleSelect2Component } from '../../common/select2-editor.component';
import { CustomRenderSmartTableStyleInputFloatComponent } from '../../common/input-float-editor.component';
import _ from "lodash";
@Component({
  selector: 'sa-style-master-regist-yield-popup',
  templateUrl: './style-master-regist-yield-popup.component.html',
  styleUrls: ['./style-master-regist-yield-popup.component.css'],
  entryComponents: [
    CustomRenderSmartTableStyleSelect2Component, CustomRenderSmartTableStyleInputFloatComponent
  ]
})
export class StyleMasterRegistYieldPopupComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  cate_cd: number;
  isDisable: boolean = false;
  @Input() ParentInfo: string;
  @Output() childCall = new EventEmitter();
  cateId: any;
  isFilterGrid: boolean = true;
  //----------------------------------------------------

  source: LocalDataSource = new LocalDataSource();
  detailInfo: StyleMasterYieldModel;
  detailInfoArray: StyleMasterYieldModel;
  listSMStyleYield: GeneralMasterModel[] = [];
  detailTableToShow: StyleMasterYieldModel[] = [];

  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public styleMasterService: StyleMasterService,
    private modalService: BsModalService,
    private router: Router,
    private generalMasterService: GeneralMasterService
  ) {
    super(userService);
    this.cate_cd = Category.OrgCateCode;
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
    },
    // Messages for form validation
    messages: {
    }
  };
  settingsSMRegistYieldComponent: any = {
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
    this.settingsSMRegistYieldComponent = {
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
        constructionGenCd: {
          title: this.i18nService.getTranslation('CONSTRUCTION'),
          type: 'string',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleSelect2Component,
            config: {
              list: _.map(this.listSMStyleYield, (p) => { return { id: p.gen_cd, text: p.gen_nm } })
            }
          },
          valuePrepareFunction: (cell, row) => {
            let valueConstr = row.constructionGenCd;
            if (valueConstr == "") {
              let mainApprovalName = this.listSMStyleYield[0];
              return mainApprovalName.gen_nm;
            }
            else {
              let mainApprovalName = this.listSMStyleYield.find(p => p.gen_cd == valueConstr);
              return mainApprovalName.gen_nm;
            }
          }
        },
        netYield: {
          title: this.i18nService.getTranslation('YIELD_NET'),
          type: 'string',
          class: 'center',
          editable: true,
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputFloatComponent,
          },
          valuePrepareFunction: (value) => {
            return parseFloat(value).toFixed(2);
          }
        },
        lostYield: {
          title: this.i18nService.getTranslation('YIELD_LOSS'),
          type: 'string',
          class: 'center',
          editable: true,
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableStyleInputFloatComponent,
          },
          valuePrepareFunction: (value) => {
            return parseFloat(value).toFixed(2)
          }
        },
        totalYield: {
          title: this.i18nService.getTranslation('YIELD_TOTAL'),
          type: 'html',
          class: 'center',
          filter: false,
          addable: false,
          editable: false,
          valuePrepareFunction: (cell, row) => {
            let subnetValue = row.netYield === null ? 0 : row.netYield;
            let sublossValue = row.lostYield === null ? 0 : row.lostYield;
            let total = (parseFloat(subnetValue) + parseFloat(sublossValue));
            return total.toFixed(2);
          }
        },
      },
      attr: {
        class: 'table table-bordered fixed_header regist-yield-table'
      },
      pager: {
        display: false,
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    }
    this.source.load(this.detailTableToShow);
  }

  ngOnInit() {
    let masStyle = JSON.parse(this.ParentInfo);
    this.detailInfo = this.styleMasterService.getStyleMasterYielddModel();
    this.detailInfo.styleSysId = masStyle.styleSysId;
    this.detailInfo.companyId = masStyle.companyId;
    return Promise.all([
      this.getConstruction()
    ]).then(res => {
      this.listSMStyleYield.push(...res[0]);
      this.initApprovalComponentDatatable();
      this.getAllDataTableDetail();
    });
  }

  onCreateStyleMaterYieldConfirm(event) {
    var self = this;
    self.notification.showCenterLoading();
    var data = event.newData;
    data.id = CommonFunction.generateId();
    if (data.netYield === "") {
      data.netYield = self.formatFloat(0) //0.00;
    }
    if (data.lostYield === "") {
      data.lostYield = self.formatFloat(0) //0.00;
    }
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.construction_gen_cd_valid) {
      self._notifyInValidField('constructionGenCd_0', false, 'select');
      invalid = true;
    }
    if (!valid.net_valid) {
      self._notifyInValidField('netYield_0', false);
      invalid = true;
    }
    if (!valid.loss_valid) {
      self._notifyInValidField('lostYield_0', false);
      invalid = true;
    }

    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('constructionGenCd_0', true, 'select');
    self._notifyInValidField('netYield_0', true);
    self._notifyInValidField('lostYield_0', true);
    self.detailInfoArray = new StyleMasterYieldModel();
    self.detailInfoArray.styleSysId = self.detailInfo.styleSysId;
    self.detailInfoArray.companyId = self.detailInfo.companyId;
    self.detailInfoArray.constructionGenCd = data.constructionGenCd;
    self.detailInfoArray.netYield = parseFloat(data.netYield);
    self.detailInfoArray.lostYield = parseFloat(data.lostYield);
    self.detailInfoArray.totalYield =  parseFloat(data.totalYield);
    self.styleMasterService.insertStyleMasterYield(self.detailInfoArray).then(rs => {
      self.notification.hideCenterLoading();
      if (rs.success) {
        _.extend(data, rs.data);
        event.confirm.resolve(data);
        self.childCall.emit('reload-regist-yield-data');
        window.postMessage('', '*');
        self.notification.showMessage("success", rs.message);
        return;
        // return self.getAllDataTableDetail();
      }
      self.notification.showMessage("error", data.message);
    });
  }

  onSaveConfirm(event) {
    var self = this;
    self.notification.showCenterLoading();
    var data = event.newData;
    if (data.netYield === "") {
      data.netYield = self.formatFloat(0) //0.00;
    }
    if (data.lostYield === "") {
      data.lostYield = self.formatFloat(0) //0.00;
    }
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.construction_gen_cd_valid) {
      self._notifyInValidField('constructionGenCd', false, 'select');
      invalid = true;
    }
    if (!valid.net_valid) {
      self._notifyInValidField('netYield', false);
      invalid = true;
    }
    if (!valid.loss_valid) {
      self._notifyInValidField('lostYield', false);
      invalid = true;
    }

    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('constructionGenCd', true, 'select');
    self._notifyInValidField('netYield', true);
    self._notifyInValidField('lostYield', true);
    self.detailInfoArray = new StyleMasterYieldModel();
    self.detailInfoArray = data;
    self.styleMasterService.updateStyleMasterYield(self.detailInfoArray).then(rs => {
      self.notification.hideCenterLoading();
      if (rs.success) {
        event.confirm.resolve(data);
        self.childCall.emit('reload-regist-yield-data');
        self.notification.showMessage("success", rs.message);
        return;
        // return self.getAllDataTableDetail();
      }
      self.notification.showMessage("error", data.message);
    });
  }
  onDeleteStyleMaterYieldConfirm(event) {
    // let value = event.data.styleYieldId;
    // this.styleMasterService.getListStyleMasterYield().then(data => {
    //   this.detailTableToShow = data.data.filter(x => x.styleSysId == this.detailInfo.styleSysId);
    //   event.data.styleYieldId = this.detailTableToShow[value - 1].styleYieldId;
    // });
    // setTimeout(() => {
    //   this.styleMasterService.deleteStyleMasterYield(event.data.styleYieldId).then(data => {
    //     if (data.success) {
    //       event.confirm.resolve(event.data);
    //       this.notification.showMessage("success", data.message);
    //       this.detailInfoArray = new StyleMasterYieldModel;
    //       return this.getAllDataTableDetail();
    //     }
    //     this.notification.showMessage("error", data.message);
    //   });
    // }, 300);
    var self = this;
    var data = event.data;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Regist Yield ?",
        content: "Are you want to delete this regist yield?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          self.notification.showCenterLoading();
          return self.styleMasterService.deleteStyleMasterYield(data.styleYieldId).then(function (rs) {
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

  private checkValidTableInput(data) {
    var result = {
      construction_gen_cd_valid: data.constructionGenCd && (data.constructionGenCd + '').trim() !== '',
      net_valid: data.netYield >= 0 && data.netYield < 10,
      loss_valid: data.lostYield >= 0 && data.lostYield < 10
    };
    return result;
  }

  private _notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  formatFloat(value) {
    var n = parseFloat(value);
    if (_.isNaN(n)) {
      return 0
    }
    return Number(n);
  }


  onClose() {
    this.modalService.hide(1);
  }

  getConstruction() {
    return this.generalMasterService.listGeneralByCate(Category.Contruction.valueOf());
  }

  getAllDataTableDetail() {
    // return this.styleMasterService.getListStyleMasterYield().then(data => {
    //   this.detailTableToShow = data.data.filter(x => x.styleSysId == this.detailInfo.styleSysId);
    //   for (var i = 0; i < this.detailTableToShow.length; i++) {
    //     this.detailTableToShow[i].styleYieldId = i + 1;
    //     this.source = new LocalDataSource(this.detailTableToShow);
    //   }
    // });
    var self = this;
    if (this.detailInfo.styleSysId && this.detailInfo.styleSysId !== 0) {
      return self.styleMasterService.getStyleMasterYieldByStyleId(this.detailInfo.styleSysId).then(function (rs) {
        if (rs.success) {
          self.detailTableToShow = _.map(rs.data, function(item, index){
            item.index = index + 1;
            item.id = CommonFunction.generateId();
            return item;
          });   
          self.source.load(self.detailTableToShow);
        }
      });
    }
  }
}
