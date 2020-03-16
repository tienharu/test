import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BomAssyMasterService } from '@app/core/services/features.services/bom-assy-master-service';
import { NameValueModel } from '@app/core/models/name-value.model';
import { BomComponentMasterModel, BomComponentItem } from '@app/core/models/bom-component-master.model';
import { CustomBomSelectEditorComponent } from './bom-select-editor.component';
import _ from 'lodash';
import { CustomBomInputEditorComponent } from './bom-input-editor.component';
import { BomAssyMasterModel, BomSearchModel, BomProcessFlowDetail, BomItem, BomCopyItem } from '@app/core/models/bom-assy-master.model';
import { CommonFunction } from '@app/core/common/common-function';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { BomCompItemComponent } from './bom-component-item/bom-component-item.component';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { LocalDataSource } from "ng2-smart-table/lib/data-source/local/local.data-source";
import { BomComponentMasterService } from '@app/core/services/features.services/bom-component-master-service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BomMasterPopupService } from '@app/core/services/features.services/bom-master-popup-service';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';

@Component({
  selector: 'sa-bom-master',
  templateUrl: './bom-master.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss','./bom-master.component.css'],
  entryComponents: [
    CustomBomInputEditorComponent, CustomBomSelectEditorComponent, BomCompItemComponent
  ]
})
export class BomMasterComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  source: LocalDataSource = new LocalDataSource();
  bomTypes: GeneralMasterModel[] = [];
  itemizeds: GeneralMasterModel[] = [];
  bomComponentItems: BomComponentItem[] = [];
  parentItems: BomAssyMasterModel[] = [];
  bomItems1: BomItem[] = [];
  bomItems2: BomItem[] = [];
  bomCopyItems: BomCopyItem[] = [];
  bomItem: BomItem;
  bomAssyDetail: BomAssyMasterModel;
  listBomComponentItem: any = [];
  bomSearch: BomSearchModel;
  bomProcessFlowDetail: BomProcessFlowDetail;
  idBomItemCopy: string = '';
  options: any;
  settingsBomComponent: any = {
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
  entryDate: any = '';

  bomNames: GeneralMasterModel[] = [];
  bizUnits: GlobalMasterModel[] = [];
  processFlowPathRoutes: BomProcessFlowDetail[] = [];
  bomStatuses: NameValueModel[] = [
    {
      name: "No",
      value: 1
    },
    {
      name: "Ingrogress",
      value: 2
    },
    {
      name: "Finished",
      value: 3
    }
  ];
  @ViewChild("popupBomItem") popupBomItem;

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public bomAssyMasterService: BomAssyMasterService,
    private bomComponentservice: BomComponentMasterService,
    public globalMasterService: GlobalMasterService,
    public i18n: I18nService,
    private generalMasterService: GeneralMasterService,
    private modalService: BsModalService,
    private bomMasterPopupService: BomMasterPopupService,
    private cdr: ChangeDetectorRef) {
    super(userService);
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

  ngOnInit() {
    this.checkPermission(ProgramList.BOM_Master.valueOf())
    this.bomSearch = new BomSearchModel();
    this.bomItem = new BomItem();
    this.bomProcessFlowDetail = new BomProcessFlowDetail();
    this.bomAssyDetail = this.bomAssyMasterService.getModel();
    this.bomAssyDetail.companyId = this.loggedUser.company_id;
    this.bomAssyDetail.creator = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    this.idBomItemCopy = '0';
    this.initDatatableBomAssy();
    this.loadCommonData().then(() => { 
      this.loadDataTableBomAssy();
    });
    this.getBomNames(); 
    this.getBizUnits();
    this.getBomitem1();
    setTimeout(() => {
      this.getProcessFlowUKID();
    }, 100);
    setTimeout(() => {
      this.getBomitem2().then(() => {
        this.initBomComponentDatatable();
      });
    }, 200);
  }

  ngAfterViewInit() {
    // (<HTMLInputElement><unknown>document.getElementsByClassName("custom-header-sharing")).classList.add("title-data-share");
    
  }

  private initDatatableBomAssy() {
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
          }, className: "center", width: "40px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.itemizeds.find(x => x.gen_cd == data.itemizedGenCd);
            if (o != null) return o.gen_nm;
            else return "N/A";
          }, className: "center", width: "150px"
        },
        { 
          //data: "assyItemName", width: "300px"
          data: (data, type, dataToSet) => {
            var o = this.bomItems1.find(x => x.itemCd == data.assyItemCd);
            if (o != null) return o.itemNm;
            else return "N/A";
          }, width: "300px"
        },
        // { data: "bomStatus", width: "100px" }
        {
          data: (data, type, dataToSet) => {
            var o = this.bomStatuses.find(x => x.value == data.bomStatus);
            if (o != null) return o.name;
            else return "N/A";
          }, class: "center", width: "100px"
        }
      ],
      pageLength: 20,
      scrollX: true,
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.loadDataTableBomAssy();
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
              var selectedText: string = rowSelected.assyItemName;
              this.notification.confirmDialog(
                "Delete BOM Master Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.bomAssyMasterService.deleteItem(rowSelected.bomAssyId).then(data => {
                      if (!data.success) {
                        this.notification.showMessage("error", data.message);
                      } else {
                        this.notification.showMessage("success","Deleted successfully");
                        this.reloadDatatable();
                        this.onReset();
                        this.parentItems.forEach((item, index) => {
                          if(item.bomAssyId === rowSelected.bomAssyId) this.parentItems.splice(index, 1);
                        })
                        this.bomCopyItems = this.parentItems;
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
      ],
    };
  }

  private initBomComponentDatatable() {
    this.settingsBomComponent = {
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
        index: {
          title: 'No',
          type: 'text',
          editable: false,
          filter: false,
          addable: false,
          valuePrepareFunction: (value, row, cell) => {
            return cell.row.index + 1;
          }
        },
        bomComponentItemNm: {
          title: this.i18n.getTranslation('COMPONENT_ITEM_NAME'),
          class: 'center',
          filter: false,
          type: 'html',
          editor: {
            type: 'custom',
            component: BomCompItemComponent,
            config: { list: this.itemizeds, list2: this.bomItems2 }
          }
        },
        // bomComponentSeq: {
        //   type: 'string',
        //   class: 'center',
        //   editable: false,
        //   filter: false,
        //   addable: false,
        //   //valuePrepareFunction: (cell, row) => { return row.item_unit_text }
        // },
        itemized: {
          title: this.i18n.getTranslation('ITEMIZED'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        unit: {
          title: this.i18n.getTranslation('UNIT'),
          type: 'text',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        bomQty: {
          title: this.i18n.getTranslation('QTY'),
          type: 'html',
          class: 'center',
          filter: false,
          editor: {
            type: 'custom',
            component: CustomBomInputEditorComponent
          }
        },
        bom: {
          title: this.i18n.getTranslation('BOM_2'),
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        act: {
          title: 'Act',
          type: 'string',
          class: 'center',
          editable: false,
          filter: false,
          addable: false
        },
        remark: {
          title: this.i18n.getTranslation('DESCRIPTION'),
          type: 'text',
          filter: false,
          editor:{
            type: 'textarea'
          },
          valuePrepareFunction: (value: any) => { return value }
        },
      },
      attr: {
        class: 'table table-bordered fixed_header bom-compoent-table'
      },
      pager: {
        display: false,
      },
    }
    this.source = new LocalDataSource();
    //this.initDataBomComponent();
  }

  onRowClickBomAssy(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    setTimeout(() => {
      this.bomAssyMasterService.getBomAssyMasterByID(event.bomAssyId).then(data => {
        this.bomAssyDetail = data;
        this.bomAssyDetail.setYmd = CommonFunction.formatDate(this.bomAssyDetail.setYmd);
        this.entryDate = CommonFunction.formatDate(this.bomAssyDetail.createdTime);
        this.bomItem = data.assyItemCd ? this.bomItems1.find(x => x.itemCd == data.assyItemCd) : new BomItem();
        this.bomCopyItems = this.parentItems.filter(x => x.bomAssyId != data.bomAssyId);
        this.initData(data.bmMasBomComponent);
        this.cdr.detectChanges();
      });
      (<HTMLInputElement>document.getElementById("bomNoDetail")).disabled = true;
      (<HTMLInputElement>document.getElementById("bomNoDetail")).classList.remove("required");
    }, 100);
  }

  private initData(data) {
    data.forEach(element => {
      var item:BomItem = this.bomItems2.find(x => x.itemCd == element.assyItemId);
      element.itemized = item.itemizedNm;
      element.bomComponentItemNm = item.itemNm;
      element.assyItemId = item.itemCd;
      element.unit = item.stockUnitNm;
      element.act = element.useYn ? 'Yes' : 'No';
    })
    this.source = new LocalDataSource(data);
  }

  createConfirm(value) {
    var self = this;
    if(!value.newData.bomComponentItemNm) {
      self.notifyInValidField('bomComponentItemNm_0', false);
      return;
      //value.confirm.reject(value.newData);
    }
    value.confirm.resolve(value.newData);
  }

  onUpdateConfirm(event) {
    event.confirm.resolve(event.newData);
  }

  onDeleteConfirm(event) {
    var self = this;
    if(event.data.bomComponentId == null || event.data.bomComponentId == '') {
      self.source.remove(event.data);
    } else {
      if (!self.permission.canDelete) {
        self.notification.showMessage("error", self.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
        return;
      }
      self.notification.smartMessageBox(
        {
          title: "<i class='fa fa-remove txt-color-orangeDark'></i> Delete Component?",
          content: "Are you want to delete this component?",
          buttons: "[No][Yes]"
        },
        ButtonPressed => {
          if (ButtonPressed == "Yes") {
            if (event.data.bomComponentId) {
              return self.bomComponentservice.deleteBomComponent(event.data.bomComponentId).then(function (rs) {
                if (rs.success) {
                  self.notification.showMessage("success", "Delete BOM Component successfully!");
                  self.source.remove(event.data);
                }
              });
            }
          }
        }
      )
    }
  }

  onSubmit() {
    this.source.getAll().then((data) => {
      this.bomAssyDetail.companyId = this.loggedUser.company_id;
      this.bomAssyDetail.bomStatus = parseInt(this.bomAssyDetail.bomStatus.toString());
      this.bomAssyDetail.bomName = this.bomNames.find(x => x.gen_cd == this.bomAssyDetail.bomNo).gen_nm;
      let table = $('.tableGetBomAssy').DataTable();
      if (this.bomAssyDetail.bomAssyId === '') {
        //add data table to Bomassy model       
        data.forEach(element => {
          let fixData = new BomComponentMasterModel();
          fixData.creator = this.loggedUser.user_name;
          fixData.companyId = this.loggedUser.company_id;
          fixData.assyItemId = element.assyItemId;
          fixData.bomQty = element.bomQty;
          fixData.remark = element.remark;  
          this.bomAssyDetail.bmMasBomComponent.push(fixData);
        });
        this.bomAssyMasterService.insertBomAssy(this.bomAssyDetail).then(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.message);
          } else {
            this.notification.showMessage("success", "Insert BOM Assy successfully!");
            //this.reloadDatatable();
            //Set focus new row was createdz
            this.bomAssyDetail.bmMasBomComponent = data.data.bmMasBomComponent;
            this.bomAssyDetail.bomAssyId = data.data.bomAssyId;
            this.bomAssyDetail.bomAssySeq = data.data.bomAssySeq;
            this.bomAssyDetail.createdTime = CommonFunction.formatDate(data.data.createdTime);
            this.bomAssyDetail.changedTime = data.data.changedTime;
            // - add data for BOM copy select options - start
            this.bomCopyItems.push(data.data);
            this.parentItems.push(data.data);
            // - add data for BOM copy select options - end
            let data_temp = table.data().sort().reverse();
            data_temp.push(this.bomAssyDetail);
            table.clear();
            table.rows.add(data_temp.sort().reverse()).draw();
            table.rows(0).select();
          }
        });
      } else {
        //fix data bomComponent  
        this.bomAssyDetail.bmMasBomComponent.forEach(element => {
          if(!element.bomComponentId){
            element.bomAssyId = this.bomAssyDetail.bomAssyId;
            element.companyId = this.loggedUser.company_id;
          }
        });
        this.bomAssyMasterService.updateBomAssy(this.bomAssyDetail).then(data => {
          if (!data.success) {
            this.notification.showMessage("error", data.message);
          } else {
            this.notification.showMessage("success", data.message);
            //this.reloadDatatable();
          }
        });
      }
    });
  }

  onSearch() {
    this.bomSearch.bomNo = this.bomSearch.bomNo == null ? '' : this.bomSearch.bomNo;
    this.bomSearch.bizUnitId = this.bomSearch.bizUnitId == null ? 0 : this.bomSearch.bizUnitId;
    this.bomSearch.itemizedGenCd = this.bomSearch.itemizedGenCd == null ? '' : this.bomSearch.itemizedGenCd;
    this.bomSearch.bomStatus = this.bomSearch.bomStatus == null ? 0 : this.bomSearch.bomStatus;

    this.bomAssyMasterService.searchBomMaster(this.bomSearch.bomNo, this.bomSearch.bizUnitId,
      this.bomSearch.itemizedGenCd, this.bomSearch.bomStatus, this.bomSearch.parentItemName).then(rs => {
        let table = $('.tableGetBomAssy').DataTable();
        table.clear();
        if (rs != null) {
          rs.sort(function (a, b) {
            return b.bomAssySeq - a.bomAssySeq;
          });
          table.rows.add(rs).draw();
          this.notification.showMessage("success", "Found " + rs.length + " BOM!");
        } else {
          table.rows.add([]).draw();
          this.notification.showMessage("error", "BOM not found!");
        }
    })
  }

  onShowPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupBomItem, config);
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  onReset() {
    //this.reloadDatatable();
    $("form.frm-detail").validate().resetForm();
    this.source.load([]);
    this.bomProcessFlowDetail = new BomProcessFlowDetail();
    this.bomAssyDetail = new BomAssyMasterModel();
    this.bomItem = new BomItem();
    this.idBomItemCopy = '0';
    this.cdr.detectChanges();
    this.bomAssyDetail.creator = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    this.bomCopyItems = this.parentItems;
    (<HTMLInputElement>document.getElementById("bomNoDetail")).disabled = false;
    (<HTMLInputElement>document.getElementById("bomNoDetail")).classList.add("required");
    //Research BOM Master
    this.bomAssyMasterService.searchBomMaster(this.bomSearch.bomNo, this.bomSearch.bizUnitId,
      this.bomSearch.itemizedGenCd, this.bomSearch.bomStatus, this.bomSearch.parentItemName).then(rs => {
        let table = $('.tableGetBomAssy').DataTable();
        table.clear();
        if (rs) {
          rs.sort(function (a, b) {
            return b.bomAssySeq - a.bomAssySeq;
          });    
          table.rows.add(rs).draw();
        }
    })
  }

  onBomNoChange(genCd: any) {
    $('#bomNo-genCd').val(genCd);
  }

  onProcessFlowUKIDChange(processPathRouteId: any) {
    if(processPathRouteId == null) {
      this.bomProcessFlowDetail = new BomProcessFlowDetail();
    } else {
      this.bomProcessFlowDetail = this.processFlowPathRoutes.find(x => x.processPathRouteId == processPathRouteId);
      this.bomAssyDetail.itemizedGenCd = this.bomProcessFlowDetail.itemizedGenCd;
    }  
  }

  onBomNoSearchChange(bomBoGenCd: any) {
    this.bomAssyDetail.bomNo = bomBoGenCd;
    if (this.bomAssyDetail.bomNo != '') {
      (<HTMLInputElement>document.getElementById("bomNoDetail")).disabled = true;
      (<HTMLInputElement>document.getElementById("bomNoDetail")).classList.remove("required");
    }
    else {
      (<HTMLInputElement>document.getElementById("bomNoDetail")).disabled = false;
      (<HTMLInputElement>document.getElementById("bomNoDetail")).classList.add("required");
    }
  }

  onParentItemChange(value) {
    this.bomComponentservice.listBomComponentParent(value).then(data => {
      this.source.append(data);
    });
  }

  getBomItem(bomItem) {
    this.bomItem = bomItem;
    this.bomAssyDetail.assyItemCd = bomItem.itemCd;
  }

  private notifyInValidField(name, valid, type = 'input') {
    if (!valid)
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-error').removeClass('state-success');
    else
      $(type + "[ng-reflect-name='" + name + "']").parent().addClass('state-success').removeClass('state-error');
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  onClickCopybtn() {
    let bomCopyItem = this.bomCopyItems.find(x => x.bomAssyId == $('#selectItemCopy').find(":selected").val());
    this.bomComponentservice.getBomComponentCopy(bomCopyItem.bomAssyId, bomCopyItem.assyItemCd).then(data => {
      if(data.length == 0) {
        this.notification.showMessage("error", "Copy Components are not found!");
        return;
      }
      data.forEach(element => {
        let item:BomItem = this.bomItems2.find(x => x.itemCd == element.assyItemId);
        element.bomComponentId = '';
        element.itemized = item.itemizedNm;
        element.bomComponentItemNm = item.itemNm;
        element.unit = item.stockUnitNm;
        element.asdas = "1232";
        element.bom = element.bomStatus == 1 ? 'No' : element.bomStatus == 2 ? 'Ingrogress' : 'Finished';
        element.act = element.active ? 'Yes' : 'No';
        this.source.append(element);
      });
      this.notification.showMessage("success", "Copy Components successfully");
    });
  }

  private loadCommonData() {
    return Promise.all([this.getItemizeds()]);
  }

  private getBomNames() {
    return this.generalMasterService.listGeneralByCate(Category.BomNo.valueOf()).then(data => this.bomNames.push(...data));
  }

  private getProcessFlowUKID() {
    return this.bomAssyMasterService.listProcessFlowUKID().then(data => this.processFlowPathRoutes.push(...data));
  }

  private getBizUnits() {
    return this.globalMasterService.listGlobalByType().then(data => this.bizUnits.push(...data));
  }

  private getItemizeds() {
    return this.generalMasterService.listGeneralByCate(Category.Itemized.valueOf()).then(data => this.itemizeds.push(...data));
  }

  private getbomComponentItems() {
    return this.bomComponentservice.listBomComponentMasterAll().then(data => this.bomComponentItems.push(...data));
  }

  private getBomitem1() {
    return this.bomMasterPopupService.getBomItem1("", "", "").then(data => this.bomItems1.push(...data));
  }

  private getBomitem2() {
    return this.bomMasterPopupService.getBomItem2("", "", "").then(data => this.bomItems2.push(...data));
  }

  private loadDataTableBomAssy() {
    return this.bomAssyMasterService.listBomAssyMasterAll().then(rs => {
      if (rs) {
        rs.sort(function (a, b) {
          return b.bomAssySeq - a.bomAssySeq;
        });
        let table = $('.tableGetBomAssy').DataTable();
        table.clear();
        table.rows.add(rs).draw();
        this.parentItems.push(...rs);
        this.bomCopyItems = rs;
      }
    });
  }
}