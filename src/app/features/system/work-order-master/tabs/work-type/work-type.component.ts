import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService, CRMSolutionApiService, NotificationService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { BsModalService } from 'ngx-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomRenderSmartTableWorkOrderInputComponent } from '../../common/input-editor.component';
import { CustomRenderSmartTableWorkOrderInputCurrencyComponent } from '../../common/input-currency-editor.component';
import { CustomRenderSmartTableWorkOrderInputFloatComponent } from '../../common/input-float-editor.component';
import { CustomRenderSmartTableWorkOrderSelect2Component } from '../../common/select2-editor.component';
import { CommonFunction } from "@app/core/common/common-function";
import { WorkOrderMasterService } from "@app/core/services/features.services/work-order-master.service";
import { MaterialMasterService } from "@app/core/services/features.services/material-master-service";
import { TraderService } from "@app/core/services/features.services/trader-master.service";

import * as _ from "lodash";

@Component({
  selector: 'sa-work-type',
  templateUrl: './work-type.component.html',
  styleUrls: ['./work-type.component.css'],
  entryComponents: [
    CustomRenderSmartTableWorkOrderInputComponent, CustomRenderSmartTableWorkOrderInputCurrencyComponent, CustomRenderSmartTableWorkOrderSelect2Component,
    CustomRenderSmartTableWorkOrderInputFloatComponent
  ]
})
export class WorkTypeComponent extends BasePage implements OnInit {
  @Input() woNo: number = null;
  @Input() stepSeq: number = null;
  @Input() styleSysId: number = null;
  @Input() customers: any = [];
  @Output() childCall = new EventEmitter();
  workTypes: any = [];
  suppliers: any = [];
  data: any = [];
  workTypeList: any = [];
  wSource: LocalDataSource = new LocalDataSource();
  wSettings: object = {
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
    private workOrderMasterService: WorkOrderMasterService,
    private materialMasterService: MaterialMasterService,
    private traderService: TraderService
  ) {
    super(userService);
  }


  ngOnInit() {
    var self = this;
    self.woNo = Number(self.woNo);
    self.styleSysId = Number(self.styleSysId);
    self.stepSeq = Number(self.stepSeq);
    self.workTypes = [];
    self.customers = [];
    self.loadAllData().then(function () {
      self.suppliers = _.filter(self.customers, function (item) {
        return (item.type_gen_cd + '') === '170100010000' || (item.type_gen_cd + '') === '170100020000';
      });
      return self.loadWorkTypeList();
    }).then(function () {
      self.initTable();
    });
  }

  private initTable() {
    this.wSettings = {
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
        worktypeGenCd: {
          title: this.i18nService.getTranslation('WORK_TYPE'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderSelect2Component,
            config: {
              list: _.map(this.workTypes, (r) => {
                return { id: r.gen_cd, text: r.gen_nm }
              })
            }
          },
          valuePrepareFunction: (cell, row) => {
            var workType = _.find(this.workTypes, { gen_cd: row.worktypeGenCd });
            return (workType && workType.gen_nm) || '';
          }
        },
        remark: {
          title: this.i18nService.getTranslation('DESCRIPTION'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderInputComponent,
          },
          valuePrepareFunction: (value: any) => { return value }
        },
        customerCd: {
          title: this.i18nService.getTranslation('SUPPLIER'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomRenderSmartTableWorkOrderSelect2Component,
            config: {
              list: _.map(this.suppliers, (r) => {
                return { id: r.trader_id, text: r.trader_local_nm }
              })
            },
          },
          valuePrepareFunction: (cell, row) => {
            var supplier = _.find(this.suppliers, { trader_id: Number(row.customerCd) });
            return (supplier && supplier.trader_local_nm) || '';
          }
        },
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header work-type-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };

    this.wSource.load(this.data || []);
  }

  onCreateConfirm(event) {
    var self = this;
    // self.notification.showCenterLoading();
    var data = event.newData;
    data.id = CommonFunction.generateId();
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.work_type_valid) {
      self._notifyInValidField('worktypeGenCd_0', false, 'select');
      invalid = true;
    }
    if (!valid.work_type_not_existed) {
      self._notifyInValidField('worktypeGenCd_0', false, 'select');
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('worktypeGenCd_0', true, 'select');
    // self._notifyInValidField('customerCd_0', true);
    data.created = true;
    var existed
    event.confirm.resolve(data);
    self.workTypeList.push(data);
    // self.childCall.emit(self.workTypeList);
    // return self.workOrderMasterService.insertStyleMasterMaterial(data).then(function (rs) {
    //   self.notification.hideCenterLoading();
    //   if (rs && rs.success) {
    //     self.notification.showSuccess(rs.messages || 'Create successful.');
    //     event.confirm.resolve(data);
    //   } else {
    //     self.notification.showError(rs.messages || 'Create has error. Please try again later.')
    //   }
    // });
  }

  onSaveConfirm(event) {
    var self = this;
    // self.notification.showCenterLoading();
    var data = event.newData;
    var valid = self.checkValidTableInput(data);
    var invalid = false;
    if (!valid.work_type_valid) {
      self._notifyInValidField('worktypeGenCd', false, 'select');
      invalid = true;
    }
    if (!valid.work_type_not_existed) {
      self._notifyInValidField('worktypeGenCd', false, 'select');
      invalid = true;
    }
    if (invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    self._notifyInValidField('worktypeGenCd', true, 'select');
    // self._notifyInValidField('customerCd', true);
    data.updated = true;
    event.confirm.resolve(data);
    var index = _.findIndex(self.workTypeList, function (d) {
      return d.id === data.id;
    });
    self.workTypeList[index] = data;
    // self.childCall.emit(self.workTypeList);
  }

  onDeleteConfirm(event) {
    var self = this;
    var data = event.data;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Work Type ?",
        content: "Are you want to delete this work type?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          data.deleted = true;
          event.confirm.resolve(data);
          var index = _.findIndex(self.workTypeList, function (d) {
            return d.id === data.id;
          });
          self.workTypeList[index] = data;
          // self.childCall.emit(self.workTypeList);
        }
      }
    );
  }

  onReset() {
    this.wSource.load([]);
    this.data = [];
  }

  private checkValidTableInput(data) {
    var result = {
      work_type_valid: data.worktypeGenCd && (data.worktypeGenCd + '').trim() !== '',
      work_type_not_existed: true
    };
    var exist = _.find(this.workTypeList, function (w) {
      return w.worktypeGenCd === data.worktypeGenCd && !w.deleted && w.id !== data.id;
    });
    result.work_type_not_existed = (exist === null || exist === undefined);
    return result;
  }

  private _notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  private loadWorkTypeList() {
    var self = this;
   
    if (self.woNo && self.stepSeq) {
      return self.workOrderMasterService.getWorkOrderWorkTypeById(self.woNo, self.stepSeq).then(function (rs) {
        var data = rs || [];
        self.data = _.map(data, function (item, index) {
          item.index = index;
          item.id = CommonFunction.generateId();
          return item;
        });
        self.workTypeList = _.clone(self.data);
      });
    }
  }

  private loadAllData() {
    return Promise.all([this.getWorkTypes(), this.getSupplier()]);
  }

  private getWorkTypes() {
    return this.generalMasterService.listGeneralByCate(Category.WorkType.valueOf()).then(data => this.workTypes.push(...data));
  }

  private getSupplier() {
    return this.traderService.ListTrader(this.companyInfo.company_id).then(data => this.customers.push(...data));
  }
}


