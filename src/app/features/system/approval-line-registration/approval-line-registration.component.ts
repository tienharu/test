import { Component, OnInit, Input } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CommonFunction } from '@app/core/common/common-function';
import { RoutingMasterService } from '@app/core/services/features.services/routing-master.service';
import { RoutingMasterModel } from '@app/core/models/routing-master.model';
import { parse } from 'path';
import _ from 'lodash';
import { TraderModel } from '@app/core/models/trader.model';
import { LocalDataSource } from "ng2-smart-table/lib/data-source/local/local.data-source";
import { ApprovalLineRegistrationHeaderModel } from '@app/core/models/approval-line-registration-header.model';
import { ApprovalLineRegistrationService } from '@app/core/services/features.services/approval-line-reg.service';
import { ApprovalLineRegiatrationComponent } from './approval-popup-infor/approval-popup-infor.component';
import { ApprovalLineRegistrationSysUsers, ApprovalLineRegistrationDetailModel } from '@app/core/models/approval-line-registration-detail.model';
import { CustomProcessComponent } from './process.component';
import { CustomTypeComponent } from './type.component';
import { ApprovalLineRegiatrationSubComponent } from './approval-popup-infor-sub/approval-popup-infor-sub.component';

@Component({
  selector: 'sa-approval-line-registration',
  templateUrl: './approval-line-registration.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss', './approval-line-registration.component.css'],
  entryComponents: [
    ApprovalLineRegiatrationComponent,CustomProcessComponent,CustomTypeComponent,ApprovalLineRegiatrationSubComponent
  ]
})
export class ApprovalLineRegComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  detailInfo: ApprovalLineRegistrationHeaderModel;
  itemizeds: GeneralMasterModel[] = [];
  bizUnits: GlobalMasterModel[] = [];
  stockUnits: GeneralMasterModel[] = [];
  routingInfoes: RoutingMasterModel[] = [];
  source: LocalDataSource = new LocalDataSource;
  dateTimeNow: string;
  listSysUser: ApprovalLineRegistrationSysUsers[] = [];
  listProcessApprovor: GeneralMasterModel[] = [];
  listTypeApprovor: GeneralMasterModel[] = [];
  listProcessApprovorShow: any[] = []
  listTypeApprovorShow: any[] = []
  positions: GeneralMasterModel[] = [];
  //--------------------------------------------Add funtion to the right
  traderInfo: TraderModel;
  @Input() traderId: number;
  //--------------------------------------------
  options: any;
  cateId: any;
  isFilterGrid: boolean = true;
  //-------------------------------------------------//
  listStep = [
    { value: "1", title: "1" },
    { value: "2", title: "2" },
    { value: "3", title: "3" },
    { value: "4", title: "4" },
    { value: "5", title: "5" },
    { value: "6", title: "6" },
    { value: "7", title: "7" },
    { value: "8", title: "8" },
    { value: "9", title: "9" }
  ];
  listInOut = [
    { value: 1, title: "In" },
    { value: 0, title: "Out" },
  ];
  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public i18n: I18nService,
    public approvalLineRegistrationService: ApprovalLineRegistrationService,
    public routingMasterService: RoutingMasterService,
    private generalMasterService: GeneralMasterService) {
    super(userService);
    this.cate_cd = Category.OrgCateCode;
  }
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      cate_cd: {
        required: true
      },
      general_nm: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      cate_cd: {
        required: "Please select the category"
      },
      general_nm: {
        required: "Please enter the general name"
      },
    }
  };
  settingsApprovalComponent: any = {
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
    this.settingsApprovalComponent = {
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
        aprvlprocsgen: {
          title:  this.i18nService.getTranslation('AR_TPROCESS'),
          type: 'string',
          editable: true,
          filter: false,
          editor: { type: 'custom', component: CustomProcessComponent, config: { list: this.listProcessApprovor }},
          valuePrepareFunction: (cell, row) => {
            var aprvlprocsgenName = this.listProcessApprovorShow.find(p=>p.value == row.aprvlprocsgen);
            return aprvlprocsgenName.title;
          }
        },
        approvertypegen: {
          title:  this.i18nService.getTranslation('AR_TYPE'),
          class: 'center',
          filter: false,
          type: 'string',
           editable: true,
          editor: { type: 'custom', component: CustomTypeComponent, config: { list: this.listTypeApprovor }},
          valuePrepareFunction: (cell, row) => {
            if(row.approvertypegen == null ){
              return row.approvertypegen = "";
            }
            var approvertypegenName = this.listTypeApprovorShow.find(p=>p.value == row.approvertypegen);
            return approvertypegenName.title;
          }
        },
        stepvalue: {
          title:  this.i18nService.getTranslation('AR_STEP'),
          type: 'string',
          class: 'center',
          // editable: false,
          filter: false,
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.listStep
            }, 
          },
        },
        mainapproverid: {
          title:  this.i18nService.getTranslation('AR_NAME'),
          type: 'text',
          class: "left",
          editable: true,
          filter: false,
          editor: { type: 'custom', component: ApprovalLineRegiatrationComponent },
          valuePrepareFunction: (cell, row) => {
            var mainApprovalName = this.listSysUser.find(p=>p.user_id == row.mainapproverid);
            return mainApprovalName.user_nm;
          }
        },
        mainapproverpositiongid: {
          title:  this.i18nService.getTranslation('AR_POSITION'),
          type: 'html',
          class: 'center',
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            var mainApprovalGenPossition = this.positions.find(p=>p.gen_cd == row.subapproverpositiongid);
            return mainApprovalGenPossition.gen_nm;
          }

        },
        maincompinoutvalue: {
          title:  this.i18nService.getTranslation('AR_COM'),
          type: 'string',
          class: 'center',
          editable: true,
          filter: false,
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.listInOut
            },
          },
          valuePrepareFunction: (value) => {
            let mps = value == '1' ? 'In' : value == 1 ? 'In':'Out';
            return mps;
          },
        },
        subapproverid: {
          title: this.i18nService.getTranslation('AR_NAME'),
          type: 'string',
          class: 'center',
          editable: true,
          filter: false,
          editor: { type: 'custom', component: ApprovalLineRegiatrationSubComponent },
          valuePrepareFunction: (cell, row) => {
            var ApprovalSubName = this.listSysUser.find(p=>p.user_id == row.subapproverid);
            return ApprovalSubName.user_nm;
          }
        },
        subapproverpositiongid: {
          title:  this.i18nService.getTranslation('AR_POSITION'),
          type: 'html',
          class: 'center',
          filter: false,
          addable: false,
          valuePrepareFunction: (cell, row) => {
            var ApprovalGenSubPossition = this.positions.find(p=>p.gen_cd == row.subapproverpositiongid);
            return ApprovalGenSubPossition.gen_nm;
          }
        },
        subcompinoutvalue: {
          title: this.i18nService.getTranslation('AR_COM'),
          type: 'string',
          class: 'center',
          editable: true,
          filter: false,
          editor: {
            type: 'list',
            config: {
              selectText: 'Select',
              list: this.listInOut
            },
          },
          valuePrepareFunction: (value) => {
            let mps = value == '1' ? 'In' : value == 1 ? 'In':'Out';
            return mps;
          },
        },
      },
      attr: {
        class: 'table table-bordered fixed_header process-path-route-table'
      },
      pager: {
        display: false,
      },
    }
    this.source = new LocalDataSource();
  }

  onCreateProcessConfirm(event) {
    event.confirm.resolve(event.newData);
  }
  onSaveConfirm(event) {
    event.confirm.resolve(event.newData);
    let value = event.newData.transseq;

    let nameMainVaule = event.newData.mainapproverid;
    let nameSubVaule = event.newData.subapproverid;
    event.newData.mainapproverusername = this.listSysUser.find(p=>p.user_id == nameMainVaule).user_nm;
    event.newData.subapproverusername = this.listSysUser.find(p=>p.user_id == nameSubVaule).user_nm;
    
    this.source.getAll().then((data) => {
      let index = _.findIndex(data, function (chr) {
        return chr.transseq == value;
      });
      data[index] = event.newData;
    });
  }
  onDeleteProcessConfirm(event) {
    event.confirm.resolve(event.data);
  }
  onSaveAll() {
    var shef = this;
    shef.source.getAll().then((data) => {
      this.detailInfo.numStep = data.length;
      let fixData = new ApprovalLineRegistrationDetailModel();
      data.forEach(item => {      
        if (item.aprvllinecd != 0 || item.aprvllinecd != undefined){
          fixData.creator = null;
          fixData.changer = null;
          fixData.createdTime =  new Date().toString('yyyy-MM-dd');
          fixData.changedTime =  new Date().toString('yyyy-MM-dd');
        }
        fixData.aprvlLineCd = this.detailInfo.aprvlLineCd;
        fixData.companyId = this.detailInfo.companyId;
        fixData.transSeq = parseInt(item.stepvalue);
        fixData.aprvlProcsGen = item.aprvlprocsgen;
        fixData.approverTypeGen = item.approvertypegen;
        fixData.stepValue = parseInt(item.stepvalue);
        fixData.mainApproverId = item.mainapproverid;
        fixData.subApproverId = item.subapproverid;
        fixData.mainCompInOutValue = item.maincompinoutvalue;
        fixData.subCompInOutValue = item.subcompinoutvalue;
        fixData.remark = item.remark;
        shef.detailInfo.BmApprovalDetail.push(fixData);
        fixData = new ApprovalLineRegistrationDetailModel();
      });
      setTimeout(() => {
        this.approvalLineRegistrationService.insertApprovalDetail(this.detailInfo.BmApprovalDetail).then(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.message);
          } else {
            this.reloadDatatable();
            this.notification.showMessage("success", data.message);
            this.detailInfo.BmApprovalDetail = [];
            this.source = new LocalDataSource;
          }
        });
      }, 300);
    });
  }
  ngOnInit() {
    this.checkPermission(ProgramList.Approval_Line_Registration.valueOf());
    this.dateTimeNow = new Date().toString('yyyy-MM-dd');
    this.detailInfo = this.approvalLineRegistrationService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.initDatatable()
    this.initApprovalComponentDatatable();
    return Promise.all([
      this.getSysUsers(),
      this.getProcess(),
      this.getType(),
      this.getPositions(),
    ]).then(res => {
      this.listSysUser.push(...res[0]);
      this.listProcessApprovor.push(...res[1]);
      this.listTypeApprovor.push(...res[2]);
      this.positions.push(...res[3]);
      for (let i = 0; i < this.listProcessApprovor.length; i++) {
        this.listProcessApprovorShow.push({ value: parseInt(this.listProcessApprovor[i].gen_cd), title: this.listProcessApprovor[i].gen_nm });
      }
      for (let i = 0; i < this.listTypeApprovor.length; i++) {
        this.listTypeApprovorShow.push({ value: parseInt(this.listTypeApprovor[i].gen_cd), title: this.listTypeApprovor[i].gen_nm });
      }
      $('ng2-smart-table .process-path-route-table thead tr:first').before(
        '<tr><th style="width:32%;background: #6D6C6E; color: white" colspan="3">' + this.i18nService.getTranslation('AR_PROPERTIES') + '</th>' +
        '<th style ="width:28%;background: #6D6C6E; color: white" colspan="3">' + this.i18nService.getTranslation('AR_MAIN_APPROVER') + '</th>' +
        '<th style ="width:28%;background: #6D6C6E; color: white" colspan="3">' + this.i18nService.getTranslation('AR_SUB_APPROVER') + '</th>' +
        '<th style ="width:12%;background: #6D6C6E; color: white">Actions</th></tr>');
      this.initApprovalComponentDatatable();
      this.loadDataTable();
    });
  }
  private getCategories() {
    return this.generalMasterService.listGeneralCategory();
  }
  onCheckSale(event) {
    $("#price").attr('disabled', !event.target.checked);
    if (event.target.checked) {
      $("#background-price-disabled").removeClass("state-disabled");
    } else {
      $("#background-price-disabled").addClass("state-disabled");
    }
  }
  private loadDataTable() {
    return this.approvalLineRegistrationService.listApprovalLineRegistrationHeaderAll().then(rs => {
      rs.sort(function (a, b) {
        return b.aprvlLineCd - a.aprvlLineCd;
      });
      var table = $('.tableGetApproval').DataTable();
      table.clear();
      table.rows.add(rs).draw();
    });
  }
  private getParents(value) {
    return new Promise<any>((resolve, reject) => {
      resolve([]);
    });
  }
  onGetParent(value, event) {
    this.getParents(value).then(data => {
      this.parents.push(...data);
    }).then(() => {
      this.detailInfo = event;
    })
  }
  onCateChange(cateId) {
    if (this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }
  private initDatatable() {
    this.options = {
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
          }, className: "center", width: "5%"
        },
        { data: "aprvlLineCd", class: "center", width: "5%" },
        { data: "aprvlLineKoreaNm", class: "left", width: "25%" },
        { data: "numStep", class: "center", width: "5%" },
        { data: "numRefer", class: "center", width: "5%" },
        {
          data: (data, type, dataToSet) => {
            return data.urgentYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.useYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        { data: "aprvlLineEngNm", class: "left", width: "25%" },
        { data: "remark", class: "left", width: "20%" },

      ],
      pageLength: 25,
      scrollX: true,
      scrollY: 120,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.loadDataTable();
            this.settingReset();
            this.detailInfo = new ApprovalLineRegistrationHeaderModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if (!this.permission.canDelete) {
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.apprlLineKorNm;
              this.notification.confirmDialog(
                "Delete Approval-line Registration Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.approvalLineRegistrationService.deleteApprovalHeader(rowSelected.aprvlLineCd).then(data => {
                      if (!data.success) {
                        this.notification.showMessage("error", data.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          "Deleted successfully"
                        );
                        this.reloadDatatable();
                        this.settingReset();
                      }
                    })
                  }
                }
              );
            }
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }
  gettable(a: any) {
    this.source = new LocalDataSource();
    this.approvalLineRegistrationService.listApprovalLineRegistrationDetailAll(a).then(data => {
      this.detailInfo.numStep = data.length;
      this.source = new LocalDataSource(data.reverse());
    });
  }
  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    setTimeout(() => {
      this.gettable(this.detailInfo.aprvlLineCd);
    }, 100);
    this.isFilterGrid = false;
    let value = event.cate_cd;
    setTimeout(() => {
      this.detailInfo = event;
    }, 10);

    // setTimeout(() => {
    //   this.isFilterGrid = true;
    // }, 200);
  }
  getSysUsers() {
    return this.approvalLineRegistrationService.listSysUsers(this.loggedUser.company_id);
  }
  getProcess() {
    return this.approvalLineRegistrationService.listGeneralProcess(Category.ApProcess.valueOf());
  }
  getType() {
    return this.approvalLineRegistrationService.listGeneralType(Category.ApType.valueOf());
  }
  getPositions() {
    return this.approvalLineRegistrationService.getPositions(this.loggedUser.company_id);
  }
  onSubmit() {
    this.detailInfo.companyId = this.loggedUser.company_id;
    let table = $('.tableGetApproval').DataTable();
    if (this.detailInfo.aprvlLineCd === 0) {
      this.detailInfo.changedTime = new Date().toString('yyyy-MM-dd');
      this.detailInfo.createdTime = new Date().toString('yyyy-MM-dd');
      this.source.getAll().then((data) => {
      this.detailInfo.numStep = data.length;
        });
      this.approvalLineRegistrationService.insertApprovalHeader(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", "Inserted Successful");
          this.detailInfo.aprvlLineCd = data.data.aprvllinecd;
          setTimeout(() => {
            this.onSaveAll();
          }, 300);
         // this.reloadDatatable();
        }
      });
    } else {
      this.approvalLineRegistrationService.insertApprovalHeader(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", "Inserted Successful");
          this.detailInfo.aprvlLineCd = data.data.aprvllinecd;
          setTimeout(() => {
            this.onSaveAll();
          }, 300);
         // this.reloadDatatable();
        }
      });
    }
  }

  onReset() {
    this.isFilterGrid = true;
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.settingReset();
    this.detailInfo = new ApprovalLineRegistrationHeaderModel();
    this.source = new LocalDataSource();
  }

  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
    this.loadDataTable();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
  private getItemized() {
    return this.approvalLineRegistrationService.listGeneralItemized();
  }
  private getBizUnit() {
    return this.approvalLineRegistrationService.listGlobalByType();
  }
  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }
  private getRouting() {
    return this.approvalLineRegistrationService.listRouting();
  }
  private settingReset() {
    this.detailInfo = new ApprovalLineRegistrationHeaderModel();
    //this.cdr.detectChanges();
    this.detailInfo.creator = this.loggedUser.user_name;
    // this.entryDate = new Date().toString('yyyy-MM-dd');
    // (<HTMLInputElement>document.getElementById("stock-unit-selected")).value = '';
    $("#price").attr('disabled', true);
    $("#background-price-disabled").addClass("state-disabled");
  }
  sharingToSelected(data) {
  }
}
