import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { RoutingMasterModel } from '@app/core/models/routing-master.model';
import { ProcessFlowHeaderModel } from '@app/core/models/process-flow-header-model';
import { ProcessFlowPathModel } from '@app/core/models/process-flow-path-model';
import { ProcessFlowPathRouteModel } from '@app/core/models/process-flow-path-route-model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import { RoutingMasterService } from '@app/core/services/features.services/routing-master.service';
import { ProcessFlowMasterService } from "@app/core/services/features.services/process-flow.service";
import { CustomRenderSmartTableProcessInputComponent } from './process-input-editor.component';
import { CustomRenderSmartTableProcessSelectComponent } from './process-select-editor.component';
import { CustomRenderSmartTableProcessSelect2Component } from './process-select2-editor.component';
import { CustomRenderSmartTableProcessCheckboxComponent } from './process-checkbox-editor.component';
import { CommonFunction } from "@app/core/common/common-function";

import { I18nService } from '@app/shared/i18n/i18n.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { NgForm } from '@angular/forms';
import { Observable, fromEventPattern } from 'rxjs';
import * as moment from 'moment';
import _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { createEmptyStateSnapshot } from '@angular/router/src/router_state';
import { V, rS } from '@angular/core/src/render3';
import { runInThisContext } from 'vm';
import { setFlagsFromString } from 'v8';
@Component({
  selector: 'sa-process-flow-master',
  templateUrl: './process-flow-master.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss', "./process-flow-master.component.css"],
  entryComponents: [
    CustomRenderSmartTableProcessInputComponent, CustomRenderSmartTableProcessSelectComponent, CustomRenderSmartTableProcessSelect2Component, CustomRenderSmartTableProcessCheckboxComponent
  ]
})
export class ProcessFlowMasterComponent extends BasePage implements OnInit {
  //
  digitRegx: RegExp = /^(0|[1-9][0-9]*)$/;
  min_maxRegex: RegExp = /^([1-9]|[1-8][0-9]|9[0-9]|100)$/;
  decimalsRegex: RegExp = /^[1-9]\d*(\.\d+)?$/;
  stockUnits: GeneralMasterModel[] = [];
  itemizeds: GeneralMasterModel[] = [];
  itemsCate: GeneralMasterModel[] = [];
  routingLst: RoutingMasterModel[] = [];
  //
  headerInfo: ProcessFlowHeaderModel;
  pathsSource: LocalDataSource = new LocalDataSource();
  pathRouteSource: LocalDataSource = new LocalDataSource();
  paths: any = [];
  pathRoutes: any = [];
  storePathRoutes: any = [];
  //
  pathsInfo: ProcessFlowPathModel[] = [];
  pathRoutesInfo: ProcessFlowPathRouteModel[] = [];
  //
  isEdit: boolean = false;
  items: any = [];
  page: number = 1;
  pageSize: number = 10000;
  registerInfo: any;
  pathCCR: any = null;
  settingsPath: object = {};
  settingsPathRoute: any = {
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
    }
  };
  selectedPath: ProcessFlowPathModel = new ProcessFlowPathModel();
  ccrPathRoute: ProcessFlowPathRouteModel = new ProcessFlowPathRouteModel();
  allowEditRoute: boolean = false;
  table: any;
  userLogin: any;
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    private generalMasterService: GeneralMasterService,
    private globalMasterService: GlobalMasterService,
    private routingMasterService: RoutingMasterService,
    private processFlowMasterService: ProcessFlowMasterService,
    private _sanitizer: DomSanitizer
  ) {
    super(userService);

  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      process_name: {
        required: true
      },
      item_cate: {
        required: true
      },
      unit_stock: {
        required: true
      },
      start_time: {
        required: true
      },
      finish_time: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      item_cate: {
        required: "Please select item category"
      },
      unit_stock: {
        required: "Please select unit stock"
      },
      start_time: {
        required: "Please select start time"
      },
      finish_time: {
        required: "Please select finish time"
      },
      process_name: {
        required: "Please enter the process flow name"
      }
    }
  };

  ngOnInit() {
    var self = this;
    // self.checkPermission(ProgramList.Process_Flow_Master.valueOf())
    self.userLogin = self.loggedUser;
    self.initModel();
    self.initTable();
    self.initPathTable();
    self.loadCommonData().then(function () {
      self.initPathRouteTable();
      self.search();
    });
    self.getProcessFlowInformation();
  }

  ngAfterViewInit() {
    $('b[role="presentation"]').hide();
    $('.select2-selection__arrow').append('<i class="fa fa-angle-down" style="select2-selection__arrow"></i>');
  }

  initModel() {
    var self = this;
    self.headerInfo = self.processFlowMasterService.getProcessFlowModel();
    self.headerInfo.companyId = self.companyInfo.company_id;
    self.registerInfo = {
      register: self.userLogin.user_name || '',
      registerDate: moment().format('YYYY.MM.DD'),
      startRouting: {},
      finalRouting: {},
      ccr: {},
      totalRouting: 0,
      degree: 0,
      status: 'no'
    };
    if (self.isEdit) {
      self.registerInfo.register = self.headerInfo.creator || self.userLogin.user_name || '';
      if (self.headerInfo.createTime) {
        self.registerInfo.registerDate = moment(self.headerInfo.createTime).format('YYYY.MM.DD');
      }
      if (self.headerInfo.workFinishTime) {
        self.headerInfo.workFinishTime = moment(self.headerInfo.workFinishTime).format('hh:mm A');
      }
      if (self.headerInfo.workStartTime) {
        self.headerInfo.workStartTime = moment(self.headerInfo.workStartTime).format('hh:mm A');
      }
      self.getProcessFlowInformation();
    }
  }

  search() {
    var self = this;
    var table = $('.tableProcessFlow').DataTable();
    self.notification.showCenterLoading();
    return self.processFlowMasterService.getAllProcessFlow(self.pageSize, self.page).then(data => {
      self.items = data.data || [];
      table.clear();
      table.rows.add(self.items).draw();
      self.notification.hideCenterLoading();
    });
  }

  loadProcessDetail(data) {
    var self = this;
    var detail = _.clone(data), paths = _.clone(data.bmMasProcessflowPath);
    paths = _.sortBy(paths, ["processStepNo", 'pathUkId', 'index']);
    delete detail.bmMasProcessflowPath;
    detail.processFlowNm = detail.processflowNm
    self.isEdit = true;
    self.headerInfo = detail;
    var reqs = [];
    if (paths.length > 0) {
      reqs = _.map(paths, function (p) {
        p.id = CommonFunction.generateId();
        return self.processFlowMasterService.getPathRouteByPathId(p.processPathId).then(function (rs) {
          p.bmMasProcessflowPathRoute = (rs && rs.data) || [];
          if (p.bmMasProcessflowPathRoute && p.bmMasProcessflowPathRoute.length > 0) {
            p.bmMasProcessflowPathRoute = _.sortBy(p.bmMasProcessflowPathRoute, ['pathOrderSeq', 'processflowUkId']);
            p.pathDegree = p.bmMasProcessflowPathRoute[p.bmMasProcessflowPathRoute.length - 1].completenessDegree || 0;
            var ccr = _.find(p.bmMasProcessflowPathRoute, function (r) {
              return r.ccrYn;
            });
            if (ccr) {
              self.pathCCR = p;
            }
          }
          return p;
        });
      });
    }
    return Promise.all(reqs).then(function () {
      self.notification.hideCenterLoading();
      self.paths = self._tableActions(self.paths, paths, 'load', self.pathsSource, ["processStepNo", 'pathUkId', 'index']);
      self.processFlowMasterService.storeProcessFlowModel(detail);
      self.initModel();
    });
  }

  onCreatePathConfirm(event) {
    var self = this;
    var data = event.newData;
    data.id = CommonFunction.generateId();
    data.index = self.paths.length;
    var invalid = false;
    var valid = self.checkValidPath(data, false);
    if (!valid.stepValid) {
      self._notifyInValidField('processStepNo_0', false);
      invalid = true;
    }
    if (!valid.nameValid) {
      self._notifyInValidField('processPathNm_0', false);
      invalid = true;
    }
    if (invalid) {
      return;
    }
    self._notifyInValidField('processPathNm_0', true);
    self._notifyInValidField('processStepNo_0', true);
    event.confirm.resolve(data);
    self.paths = self._tableActions(self.paths, data, 'add', self.pathsSource, ["processStepNo", 'pathUkId', 'index']);
  }

  onSavePathConfirm(event) {
    var self = this;
    var data = event.newData;
    var valid = self.checkValidPath(data, true);
    var invalid = false;
    if (!valid.stepValid) {
      self._notifyInValidField('processStepNo', false);
      invalid = true;
    }
    if (!valid.nameValid) {
      self._notifyInValidField('processPathNm', false);
      invalid = true;
    }
    if (invalid) {
      return;
    }
    self._notifyInValidField('processPathNm', true);
    self._notifyInValidField('processStepNo', true);
    event.confirm.resolve(data);
    self.paths = self._tableActions(self.paths, data, 'edit', self.pathsSource, ["processStepNo", 'pathUkId', 'index']);
  }

  onDeletePathConfirm(event) {
    var self = this;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Path ?",
        content: "Are you want to delete this path?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          event.confirm.resolve(event.data);
          self.paths = self._tableActions(self.paths, event.data, 'del', self.pathsSource, ["processStepNo", 'pathUkId', 'index']);
          setTimeout(() => {
            self.pathRoutes = self._tableActions(self.pathRoutes, [], 'load', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId']);
            self.storePathRoutes = _.clone(self.pathRoutes);
            $('.process-path-route-table .ng2-smart-filters').hide();
          }, 50);
          self.setPathInfomation();
          self.getProcessFlowInformation();
          if (event.data.processPathId) {
            return self.processFlowMasterService.deletePath(event.data.processPathId).then(function (rs) {
              if (rs.success) {
                self._updatePartialProcessField();
              }
            });
          }
        }
      }
    );
  }

  onCreatePathRouteConfirm(event) {
    var self = this;
    var data = event.newData;
    data.id = CommonFunction.generateId();
    data.pathOrderSeq = self.pathRoutes.length + 1;
    var valid = self.checkValidPathRoute(data);
    var invalid = false;
    if (!valid.routingValid) {
      self._notifyInValidField('routeId_0', false, 'select');
      invalid = true;
    }
    if (!valid.capaValid) {
      self._notifyInValidField('capacityHourly_0', false);
      invalid = true;
    }
    if (!valid.degreeValid) {
      self._notifyInValidField('completenessDegree_0', false);
      invalid = true;
    }
    if (!valid.itemizedValid) {
      self._notifyInValidField('itemizedGenCd_0', false, 'select');
      invalid = true;
    }
    if (invalid) {
      return;
    }
    self._notifyInValidField('routeId_0', true, 'select');
    self._notifyInValidField('capacityHourly_0', true);
    self._notifyInValidField('completenessDegree_0', true);
    self._notifyInValidField('itemizedGenCd_0', true, 'select');
    data = self.getRouteInfo(data);
    if (data.ccrYn) {
      _.forEach(self.paths, function (p) {
        _.forEach(p.bmMasProcessflowPathRoute, function (r) {
          r.ccrYn = false;
        });
      });
    }
    var index = (self.pathRoutes.length + 1) + '';
    if (index.length === 1) {
      index = '0' + index;
    }
    data.processflowUkId = self.selectedPath.pathUkId + index;
    event.confirm.resolve(data);
    self.pathRoutes = self._tableActions(self.pathRoutes, data, 'add', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId']);
    //must call after self._tableActions
    self.setPathInfomation();
    self.getProcessFlowInformation();
  }

  onSavePathRouteConfirm(event) {
    var self = this;
    var data = event.newData;
    var valid = self.checkValidPathRoute(data);
    var invalid = false;
    if (!valid.routingValid) {
      self._notifyInValidField('routeId', false, 'select');
      invalid = true;
    }
    if (!valid.capaValid) {
      self._notifyInValidField('capacityHourly', false);
      invalid = true;
    }
    if (!valid.degreeValid) {
      self._notifyInValidField('completenessDegree', false);
      invalid = true;
    }
    if (!valid.itemizedValid) {
      self._notifyInValidField('itemizedGenCd', false, 'select');
      invalid = true;
    }
    if (invalid) {
      return;
    }
    self._notifyInValidField('routeId', true, 'select');
    self._notifyInValidField('capacityHourly', true);
    self._notifyInValidField('completenessDegree', true);
    self._notifyInValidField('itemizedGenCd', true, 'select');

    data = self.getRouteInfo(data);
    if (data.ccrYn) {
      _.forEach(self.paths, function (p) {
        _.forEach(p.bmMasProcessflowPathRoute, function (r) {
          r.ccrYn = false;
        });
      });
    }
    event.confirm.resolve(data);
    self.pathRoutes = self._tableActions(self.pathRoutes, data, 'edit', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId']);
    //must call after self._tableActions
    self.setPathInfomation();
    self.getProcessFlowInformation();
  }

  onDeletePathRouteConfirm(event) {
    var self = this;
    self.notification.smartMessageBox(
      {
        title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Path Route ?",
        content: "Are you want to delete this path route?",
        buttons: "[No][Yes]"
      },
      ButtonPressed => {
        if (ButtonPressed == "Yes") {
          if (event.data.ccrYn) {
            _.forEach(self.paths, function (p) {
              _.forEach(p.bmMasProcessflowPathRoute, function (r) {
                r.ccrYn = false;
              });
            });
          }
          event.confirm.resolve(event.data);
          self.pathRoutes = self._tableActions(self.pathRoutes, event.data, 'del', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId']);
          //must call after self._tableActions
          self.setPathInfomation();
          self.getProcessFlowInformation();
          if (event.data.processPathRouteId) {
            return self.processFlowMasterService.deletePathRoute(event.data.processPathRouteId).then(function (rs) {
              if (rs.success) {
                self.storePathRoutes = _.clone(self.pathRoutes);
                self._updatePartialProcessField();
              }
            });
          }
        }
      }
    );
  }

  onPathRowClick(event) {
    var data = event.data || null;
    var self = this;

    if (!event.isSelected || !data.pathUkId) {
      //row not selected and not have pathUkId (create case).
      //don't show add path route button and reset list current path routes table on UI
      $('.process-path-route-table .ng2-smart-filters').hide();
      self.pathRoutes = self._tableActions(self.pathRoutes, [], 'load', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId']);
      self.storePathRoutes = _.clone(self.pathRoutes);
      self.selectedPath = new ProcessFlowPathModel();
      self.allowEditRoute = false;
      return;
    }

    $('.process-path-route-table .ng2-smart-filters').show();
    self.allowEditRoute = true;
    self.selectedPath = data;
    var pathRoutes = data.bmMasProcessflowPathRoute || [];
    pathRoutes = _.sortBy(_.map(pathRoutes, function (r) {
      r.id = CommonFunction.generateId();
      r = self.getRouteInfo(r);
      return r;
    }), ['pathOrderSeq', 'processflowUkId']);
    self.pathRoutes = self._tableActions(self.pathRoutes, pathRoutes, 'load', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId'])
    self.storePathRoutes = _.clone(self.pathRoutes);
  }

  onRowClick(event) {
    this.notification.showCenterLoading();
    if (!event) {
      this.notification.hideCenterLoading();
      return;
    }
    this.onReset(false);
    this.loadProcessDetail(event);
  }

  onSubmit() {
    var self = this;
    self.notification.showCenterLoading();
    const _invalid = $("form.frm-detail").valid();
    if (!_invalid) {
      self.notification.hideCenterLoading();
      return;
    }
    var data = self.composeDataToSubmit();
    var req;
    if (!self.isEdit) {
      //create new process flow
      req = self.processFlowMasterService.insertProcessFlow(data);
    } else {
      //update new process flow
      req = self.processFlowMasterService.updateProcessFlow(data);
    }
    req.then(function (rs) {
      self.notification.hideCenterLoading();
      if (!rs.success) {
        self.notification.showMessage('error', rs.message);
        return false;
      }
      self.notification.showMessage('success', rs.message);
      if (!self.isEdit) {
        //reset all after created
        self.onReset(true);
        return false;
      }
      return true;
    }).then(function (result) {
      if (result) {
        //update path routes all after updated
        var reqs = _.map(data.bmMasProcessflowPath, function (p, index) {
          return self.onSaveRoute(p.bmMasProcessflowPathRoute, p.processPathId, true);
        });
        return Promise.all(reqs).then(function () {
          self.storePathRoutes = _.clone(self.pathRoutes);
          return self.reloadDatatable();
        }).then(function () {
          //reload latest data
          return self._reloadAfterSave(self.headerInfo.processflowId);
        });
      }
    });
  }

  onSaveRoute(routes, processPathId, mainSave = false) {
    var self = this;
    self.notification.showCenterLoading();
    var pathRoutes = self._convertPathRoute(routes, processPathId);
    var existed = _.find(pathRoutes, function (r) {
      return r.processPathRouteId;
    });
    var ccr = _.find(pathRoutes, function (r) {
      return r.ccrYn;
    });
    var req;
    if (!existed) {
      //create path routes list
      req = self.processFlowMasterService.insertPathRoute(pathRoutes);
    } else {
      //update path routes list
      req = self.processFlowMasterService.updatePathRoute(pathRoutes);
    }
    return req.then(function (rs) {
      self.notification.hideCenterLoading();
      if (!rs.success) {
        if (!mainSave) {
          self.notification.showMessage('error', rs.message);
        }
        return;
      }
      self.storePathRoutes = _.clone(self.pathRoutes);
      if (!mainSave) {
        self.notification.showMessage('success', rs.message);
      }
    }).then(function () {
      if (!mainSave) {
        //Update Partial Fields Of Process Flow when path routes list have changes.
        return self._updatePartialProcessField();
      }
    }).then(function () {
      if (!mainSave && ccr && self.pathCCR && self.selectedPath.processPathId !== self.pathCCR.processPathId) {
        //update path have ccr change
        var pRoutes = self._convertPathRoute(_.clone(self.pathCCR.bmMasProcessflowPathRoute) || [], _.clone(self.pathCCR.processPathId));
        self.pathCCR = self.selectedPath;
        return self.processFlowMasterService.updatePathRoute(pRoutes);
      }
    }).then(function () {
      //reload path routes
      if (self.selectedPath && self.selectedPath.processPathId) {
        return self.processFlowMasterService.getPathRouteByPathId(self.selectedPath.processPathId).then(function (rs) {
          var newRoutes = (rs && rs.data || []);
          if (newRoutes && newRoutes.length > 0) {
            self.selectedPath.bmMasProcessflowPathRoute = _.sortBy(newRoutes, ['pathOrderSeq', 'processflowUkId']);
          }
        });
      }
    });
  }

  onReset(btn = true) {
    if (btn) {
      this.reloadDatatable();
    }
    $("form.frm-detail").validate().resetForm();
    this.paths = [];
    this.pathRoutes = [];
    this.pathsSource.load([]);
    this.pathRouteSource.load([]);
    this.selectedPath = new ProcessFlowPathModel();
    this.allowEditRoute = false;
    this.processFlowMasterService.storeProcessFlowModel(new ProcessFlowHeaderModel());
    this.processFlowMasterService.storeProcessPathModel(new ProcessFlowPathModel());
    this.processFlowMasterService.storeProcessPathRouteModel(new ProcessFlowPathRouteModel());
    this.initModel();
    this.isEdit = false;
  }

  onResetPathRoute() {
    var self = this;
    self.pathRoutes = self._tableActions(self.pathRoutes, self.storePathRoutes, 'load', self.pathRouteSource, ['pathOrderSeq', 'processflowUkId']);
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  private initTable() {
    this.table = {
      dom: "Bfrtip",
      columns: [
        {
          "render": function (data, type, full, meta) {
            return meta.row + 1;
          },
          className: "center"
        },
        { data: "processflowNm", class: "left" },
        { data: "headerSeq", class: "center" },
        {
          data: (data, type, dataToSet) => {
            var itemCate = _.find(this.itemsCate, { gen_cd: data.itemCateGenCd });
            return (itemCate && itemCate.gen_nm) || '';
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            var stockUnit = _.find(this.stockUnits, { gen_cd: data.stockUnitGenCd });
            return (stockUnit && stockUnit.gen_nm) || '';
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            return data.completenessDegree === 100 ? "Yes" : "No";
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            return data && data.bmMasProcessflowPath ? data.bmMasProcessflowPath.length : '';
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            var route = _.find(this.routingLst, { routeId: data.startRouteId });
            return (route && route.routeName) || '';
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            var route = _.find(this.routingLst, { routeId: data.finalRouteId });
            return (route && route.routeName) || '';
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            var route = _.find(this.routingLst, { routeId: data.ccrRouteId });
            return (route && route.routeName) || '';
          },
          className: "center"
        },
        { data: "totalRouteCount", class: "center" },
        {
          data: (data, type, dataToSet) => {
            return data.completenessDegree + '%';
          },
          className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            return "";
          },
          className: "center"
        },
        {
          data: function (data) {
            // return data.useYn ? '<label class="atman-checkbox"><input type="checkbox" name="checkbox-inline" disabled checked><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" name="checkbox-inline" disabled><i></i></label>'
            return data.useYn ? "Yes" : "No"
          }, className: "center"
        },
        { data: "remark", class: "left" }
      ],
      scrollX: true, // header style
      bSort: false, // hide auto sort
      lengthChange: false, // hide header show entries
      paging: true, // hide footer page
      pageLength: 10,
      lengthMenu: [12],
      info: true,
    };
  }

  private initPathTable() {
    this.settingsPath = {
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
        processStepNo: {
          title: 'Step', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
          valuePrepareFunction: (value: any) => { return value }
        },
        processPathNm: {
          title: 'Path', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
          valuePrepareFunction: (value: any) => { return value }
        },
        pathUkId: {
          title: 'Code', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'html',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => { return row.pathUkId }
        },
        pathDegree: {
          title: 'Deg', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => { return row.pathDegree ? (row.pathDegree + '%') : '' }
        }
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header process-path-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };
  }

  private initPathRouteTable() {
    this.settingsPathRoute = {
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
          title: 'Step',//this.i18nService.getTranslation('SV_ITEM_LIST_TABLE_INDEX'),
          class: 'center',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction(value, row, cell) { return cell.row.index + 1; }
        },
        routeId: {
          title: 'Routing Name', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessSelect2Component, config: { list: _.map(this.routingLst, (r) => { return { id: r.routeId, text: r.routeName } }) } },
          valuePrepareFunction: (cell, row) => { return row.route_name }
        },
        route_unit: {
          title: 'Route Unit', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => { return row.route_unit }
        },
        capacityHourly: {
          title: 'Capa/H', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
          valuePrepareFunction: (value: any) => {
            var n = parseFloat(value);
            if (_.isNaN(n)) {
              return '';
            }
            return (Math.round(n * 1000) / 1000).toFixed(2);
          }
        },
        route_item_unit: {
          title: 'Item Unit', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => { return row.route_item_unit }
        },
        completenessDegree: {
          title: 'Degree', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessInputComponent },
          valuePrepareFunction: (value: any) => { return value + '%' }
        },
        controlPointYn: {
          title: 'Cont.Point', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'html',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessCheckboxComponent },
          valuePrepareFunction: (value) => {
            let cbkHtml = value ? '<label class="atman-checkbox"><input type="checkbox" id="" checked disabled></input><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" disabled></input><i></i></label>';
            return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          }
        },
        ccrYn: {
          title: 'CCR', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'html',
          filter: false,
          class: 'center',
          editor: { type: 'custom', component: CustomRenderSmartTableProcessCheckboxComponent },
          valuePrepareFunction: (value) => {
            let cbkHtml = value ? '<label class="atman-checkbox"><input type="checkbox" checked disabled></input><i></i></label>' : '<label class="atman-checkbox"><input type="checkbox" disabled></input><i></i></label>';
            return this._sanitizer.bypassSecurityTrustHtml(cbkHtml);
          }
        },
        itemizedGenCd: {
          title: 'Itemized', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          filter: false,
          editor: { type: 'custom', component: CustomRenderSmartTableProcessSelect2Component, config: { list: _.map(this.itemizeds, (r) => { return { id: r.gen_cd, text: r.gen_nm } }) } },
          valuePrepareFunction: (cell, row) => { return row.itemizedGenCd_text }
        },
        processflowUkId: {
          title: 'Last UK Id', //this.i18nService.getTranslation('OT_BASIC'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => { return row.processflowUkId }
        },
      },
      pager: {
        display: false,
      },
      attr: {
        class: 'table table-bordered fixed_header process-path-route-table'
      },
      noDataMessage: this.i18nService.getTranslation('sEmptyTable')
    };

    setTimeout(function () {
      $('.process-path-route-table .ng2-smart-filters').hide();
    }, 100);
  }

  private reloadDatatable() {
    return this.search();
  }

  private loadCommonData() {
    return Promise.all([this.getItemCate(), this.getItemized(), this.getStockUnit(), this.getRoutings()]);
  }

  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf()).then(data => this.stockUnits.push(...data));
  }

  private getItemized() {
    return this.generalMasterService.listGeneralByCate(Category.Itemized.valueOf()).then(data => this.itemizeds.push(...data));
  }

  private getItemCate() {
    return this.generalMasterService.listGeneralByCate(Category.ItemCateCode.valueOf()).then(data => this.itemsCate.push(...data));
  }

  private getRoutings() {
    return this.routingMasterService.listRoutingMasterAll().then(data => this.routingLst.push(...data));
  }

  private checkValidPath(data, edit) {
    var self = this;
    var result = {
      stepValid: (data.processStepNo + '').trim() !== '',
      nameValid: data.processPathNm.trim() !== ''
    };
    if (result.stepValid) {
      result.stepValid = self.digitRegx.test(data.processStepNo);
    }
    if (result.stepValid) {
      result.stepValid = self.min_maxRegex.test(data.processStepNo);
    }
    if (result.stepValid) {
      result.stepValid = self.checkValidStepInput(data, edit);
    }
    return result;
  }

  private checkValidPathRoute(data) {
    var result = {
      routingValid: data.routeId.trim() !== '',
      capaValid: (data.capacityHourly + '').trim() !== '',
      degreeValid: (data.completenessDegree + '').trim() !== '',
      itemizedValid: data.itemizedGenCd.trim() !== ''
    };

    if (result.capaValid) {
      result.capaValid = this.decimalsRegex.test(data.capacityHourly);
    }

    if (result.degreeValid) {
      result.degreeValid = this.decimalsRegex.test(data.completenessDegree);
    }
    if (result.degreeValid) {
      result.degreeValid = data.completenessDegree >= 0 && data.completenessDegree <= 100;
    }
    return result;
  }

  private checkValidStepInput(data, edit) {
    var self = this;
    var inputStep = parseInt(data.processStepNo);
    var paths = _.clone(self.paths);
    if (edit) {
      var paths = _.filter(paths, function (p) {
        return p.id !== data.id;
      });
    }
    var keys = _.map(Object.keys(_.groupBy(paths, "processStepNo")), function (key) {
      return parseInt(key)
    });
    var max = keys.length > 0 ? Math.max(...keys) : 0;
    var stop = 1;
    if (max !== 0) {
      stop = max + 1;
    }

    var steps = [];
    for (var i = 1; i <= stop; i++) {
      steps.push(i);
    }
    var must = keys.length === 0 ? steps : [];
    _.forEach(keys, function (key) {
      if (!steps.includes(key)) {
        must = [key];
      } else {
        must = steps;
      }
    });
    var notInclude = _.remove(_.clone(must), function (m) { return !keys.includes(m) });
    if (notInclude.length >= 2) {
      must = [notInclude[0]];
    }

    return must.includes(inputStep);//inputStep <= mStep || pre === mStep;
  }

  private setPathInfomation() {
    var self = this;
    _.forEach(self.paths, function (p) {
      if (p.id === self.selectedPath.id) {
        p.bmMasProcessflowPathRoute = self.pathRoutes;
        p.pathDegree = self.pathRoutes.length > 0 ? self.pathRoutes[self.pathRoutes.length - 1].completenessDegree : 0;
      }
    });
    self.pathsSource.load(self.paths);
  }

  private getProcessFlowInformation() {
    var self = this;
    self.registerInfo.totalRouting = this.paths ? this.paths.length : 0;
    self.registerInfo.degree = (this.paths && this.paths[this.paths.length - 1] && this.paths[this.paths.length - 1].pathDegree) || 0;
    self.registerInfo.status = parseInt(self.registerInfo.degree) === 100 ? 'finish' : 'no';
    self.registerInfo.startRouting = {};
    self.registerInfo.finalRouting = {};
    self.registerInfo.ccr = {};
    var start = self.paths[0], end = self.paths[this.paths.length - 1];
    if (start && start.bmMasProcessflowPathRoute && start.bmMasProcessflowPathRoute.length > 0) {
      var startRoute = start.bmMasProcessflowPathRoute[0];
      if (startRoute.routeId) {
        var route = _.find(self.routingLst, { 'routeId': startRoute.routeId });
        self.registerInfo.startRouting = route || null;
      }
    }
    if (end && end.bmMasProcessflowPathRoute && end.bmMasProcessflowPathRoute.length > 0) {
      var endRoute = end.bmMasProcessflowPathRoute[end.bmMasProcessflowPathRoute.length - 1];
      if (endRoute.routeId) {
        var route = _.find(self.routingLst, { 'routeId': endRoute.routeId });
        self.registerInfo.finalRouting = route || null;
      }
    }
    _.forEach(self.paths, function (p) {
      _.forEach(p.bmMasProcessflowPathRoute, function (r) {
        if (r.ccrYn && r.routeId) {
          var route = _.find(self.routingLst, { 'routeId': r.routeId });
          self.registerInfo.ccr = route || null;
        }
      });
    });
  }

  private getRouteInfo(data) {
    if (data.routeId) {
      var route = _.find(this.routingLst, function (r) {
        return r.routeId === data.routeId;
      });
      if (route) {
        data.route_name = route.routeName || ''
        if (route.stockUnitGenCd) {
          var unit = _.find(this.stockUnits, { "gen_cd": route.stockUnitGenCd });
          if (unit) {
            data.route_unit = unit.gen_nm || '';
          }
        }
      }
      var itemUnit = _.find(this.stockUnits, { "gen_cd": this.headerInfo.stockUnitGenCd });
      if (itemUnit) {
        data.route_item_unit = itemUnit.gen_nm || '';
      }
    }
    //
    if (data.itemizedGenCd) {
      var itemized = _.find(this.itemizeds, { "gen_cd": data.itemizedGenCd });
      if (itemized) {
        data.itemizedGenCd_text = itemized.gen_nm || '';
      }
    }

    return data;
  }

  private composeDataToSubmit() {
    var self = this;
    var data = _.clone(self.headerInfo);
    data.processFlowNm = data.processflowNm;
    data.bmMasProcessflowPath = [];
    var paths = _.clone(self.paths);
    if (paths.length > 0) {
      data.bmMasProcessflowPath = self._convertPath(paths);
    }
    if (data.workStartTime) {
      var workStartTime = moment().format('MM/DD/YYYY') + ' ' + data.workStartTime;
      workStartTime = workStartTime.substr(0, workStartTime.indexOf('PM'));
      if (workStartTime.trim() !== '') {
        workStartTime = workStartTime + ' PM';
      } else {
        workStartTime = workStartTime + ' AM';
      }
      data.workStartTime = moment(workStartTime).format('MM/DD/YYYY HH:mm:ss');
    }
    if (data.workFinishTime) {
      var workFinishTime = moment().format('MM/DD/YYYY') + ' ' + data.workFinishTime;
      workFinishTime = workFinishTime.substr(0, workFinishTime.indexOf('PM'));
      if (workFinishTime.trim() !== '') {
        workFinishTime = workFinishTime + ' PM';
      } else {
        workFinishTime = workFinishTime + ' AM';
      }
      data.workFinishTime = moment(workFinishTime).format('MM/DD/YYYY HH:mm:ss');
    }
    data.startRouteId = (self.registerInfo.startRouting && self.registerInfo.startRouting.routeId) || '';
    data.finalRouteId = (self.registerInfo.finalRouting && self.registerInfo.finalRouting.routeId) || '';
    data.ccrRouteId = (self.registerInfo.ccr && self.registerInfo.ccr.routeId) || '';
    data.inputStatus = self.registerInfo.status === 'finish' ? true : false;
    data.totalRouteCount = parseInt(self.registerInfo.totalRouting || 0);
    data.completenessDegree = parseFloat(self.registerInfo.degree || 0);
    return data;
  }

  private _tableActions(list, data, type, source, sorts) {
    var self = this;
    switch (type) {
      case 'add':
        list.push(data);
        break;
      case 'edit':
        var index = _.findIndex(list, { 'id': data.id })
        if (index >= 0) {
          list[index] = data;
        }
        break;
      case 'del':
        _.remove(list, function (item) { return item.id === data.id });
        break;
      default:
        //load 
        list = data;
        break;
    }
    list = _.sortBy(list, sorts);
    setTimeout(() => {
      source.load(list);
      self.getProcessFlowInformation();
    }, 25);
    return list;
  }

  private _notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  private _convertPathRoute(pathRoutes, pathId) {
    return _.map(pathRoutes, function (r) {
      r.routeId = r.routeId;
      r.processPathId = pathId;
      r.ccrYn = !r.ccrYn ? false : r.ccrYn;
      r.controlPointYn = !r.controlPointYn ? false : r.controlPointYn;
      r.capacityHourly = parseFloat(r.capacityHourly);
      r.completenessDegree = parseFloat(r.completenessDegree);
      r.processflowUkId = parseInt(r.processflowUkId);
      if (isNaN(r.processflowUkId)) {
        r.processflowUkId = 0;
      }
      return r;
    });
  }

  private _convertPath(paths) {
    var self = this;
    return _.map(paths, function (p) {
      p.processStepNo = parseInt(p.processStepNo);
      p.pathUkId = parseInt(p.pathUkId);
      if (isNaN(p.pathUkId)) {
        p.pathUkId = 0;
      }
      if (p.bmMasProcessflowPathRoute && p.bmMasProcessflowPathRoute.length > 0) {
        p.bmMasProcessflowPathRoute = self._convertPathRoute(p.bmMasProcessflowPathRoute, p.processPathId);
      }
      return p;
    });
  }

  private _updatePartialProcessField() {
    var self = this;
    var data = [
      {
        "op": "replace",
        "path": "/startRouteId",
        "value": (self.registerInfo.startRouting && self.registerInfo.startRouting.routeId) || ''
      },
      {
        "op": "replace",
        "path": "/finalRouteId",
        "value": (self.registerInfo.finalRouting && self.registerInfo.finalRouting.routeId) || ''
      },
      {
        "op": "replace",
        "path": "/ccrRouteId",
        "value": (self.registerInfo.ccr && self.registerInfo.ccr.routeId) || ''
      },
      {
        "op": "replace",
        "path": "/inputStatus",
        "value": self.registerInfo.status === 'finish' ? true : false
      },
      {
        "op": "replace",
        "path": "/totalRouteCount",
        "value": parseInt(self.registerInfo.totalRouting || 0)
      },
      {
        "op": "replace",
        "path": "/completenessDegree",
        "value": parseFloat(self.registerInfo.degree || 0)
      }
    ];
    return self.processFlowMasterService.updatePartialProcessFlow(self.headerInfo.processflowId, data).then(function () {
      self.reloadDatatable();
    });
  }

  private _reloadAfterSave(id) {
    var self = this;
    var data = _.find(self.items, function (item) {
      return item.processflowId === id;
    });
    if (data) {
      self.onRowClick(data);
    }
  }
}

