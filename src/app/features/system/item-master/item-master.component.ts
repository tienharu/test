import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { NotificationService, ProgramService, AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { CommonFunction } from '@app/core/common/common-function';
import { Observable } from 'rxjs';
import { ItemMasterModel } from '@app/core/models/item-master.model';
import { ItemMasterService } from '@app/core/services/features.services/item-master-service';
import { ProcessFlowMasterService } from '@app/core/services/features.services/process-flow.service';
import { ProcessFlowHeaderModel } from '@app/core/models/process-flow-header-model';
import { async } from '@angular/core/testing';

@Component({
  selector: 'sa-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  cate_cd: number;
  detailInfo: ItemMasterModel;

  itemizeds: GeneralMasterModel[] = [];
  globalUnits: GlobalMasterModel[] = [];
  itemCategories: GeneralMasterModel[] = [];
  stockUnits: GeneralMasterModel[] = [];
  packUnits: GeneralMasterModel[] = [];
  processFlows = {};  //Process Flow temporary
  objectKeys: any;
  standards: GeneralMasterModel[] = [];
  sizes: GeneralMasterModel[] = [];
  brands: GeneralMasterModel[] = [];
  
  entryDate: any = '';
  entryUser: string = '';
  checkItem: boolean = false;

  options: any;
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public itemMasterService: ItemMasterService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
    private globalMasterService: GlobalMasterService,
    private processFlowMasterService: ProcessFlowMasterService,
    private cdr: ChangeDetectorRef) {
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

  ngOnInit() {
    this.objectKeys = Object.keys;
    // this.checkPermission(ProgramList.Mas_Item.valueOf());
    this.detailInfo = this.itemMasterService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.entryUser = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    this.initDatatable();
    //Set Unit of Price
    $("#stock-unit-select").on("select2:select", function (e) {
      (<HTMLInputElement>document.getElementById("stock-unit-selected-1")).textContent = e.params.data.text;
      (<HTMLInputElement>document.getElementById("stock-unit-selected-2")).value = e.params.data.text;
    });
    return Promise.all([
      this.getItemizeds(),
      this.getGlobalUnits(),
      this.getItemCategories(),
      this.getStockUnits(),
      this.getPackUnits(),
      this.getProcessFlows(),
      this.getStandards(),
      this.getSizes(),
      this.getBrands()
    ]).then(res => {
      this.itemizeds.push(...res[0]);
      this.globalUnits.push(...res[1]);
      this.itemCategories.push(...res[2]);
      this.stockUnits.push(...res[3]);
      this.packUnits.push(...res[4]);
      this.processFlows = (res[5]);
      this.standards.push(...res[6]);
      this.sizes.push(...res[7]);
      this.brands.push(...res[8]);
      this.loadDataTable();
      //Set event onchange select itemizeds for enable process flow drop down list
      let items = this.itemizeds;
      $("#itemized-selected").on("select2:select", function(e) {
        if(items.find(x => x.gen_cd == e.params.data.id).ck_value_1 != "3") {
          (<HTMLInputElement>document.getElementById("process-flow-Id")).disabled = true;
          (<HTMLInputElement>document.getElementById("process-flow-Id")).classList.remove("required");
        } else {
          (<HTMLInputElement>document.getElementById("process-flow-Id")).disabled = false;
          (<HTMLInputElement>document.getElementById("process-flow-Id")).classList.add("required");
        }
       
      });
    });
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
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
          }, className: "center", width: "3%"
         },
        { data: "itemDsplNm", width: "9%" },
        { data: "itemSeq", className: "center", width: "5%" },
        {
          data: (data, type, dataToSet) => {
            var o = this.itemizeds.filter(x => x.gen_cd === data.itemizedGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.globalUnits.filter(x => x.global_unit_id == data.bizUnitId);
            if (o.length > 0) return o[0].global_unit_nm;
            else return "N/A";
          }, class: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.stockUnits.filter(x => x.gen_cd === data.stockUnitGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "3%"
        },
        {
          data: (data, type, dataToSet) => {
            return this.processFlows[data.processflowId] === undefined ? "N/A" : this.processFlows[data.processflowId];
          }, width: "7%"
        },
        { data: "bodyBarcode", width: "5%" },
        {
          data: (data, type, dataToSet) => {
            return data.barCodeYn ? "Yes" : "No";
          },
          className: "center", width: "3%"
        },
        { data: "asIsCd", className: "center", width: "6%" },
        { data: "expiryDays", className: "center", width: "4%" },
        {
          data: (data, type, dataToSet) => {
            return data.nonSalesYn ? "Yes" : "No";
          },
          className: "center", width: "3%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.factoryApprovalYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.discontinueYn ? "Yes" : "No";
          },
          className: "center", width: "3%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.outsideStockYn ? "Yes" : "No";
          },
          className: "center", width: "3%"  
        },
        { data: "objectiveQty", className: "center", width: "5%" },
        { data: "inboxingQty", className: "center", width: "5%" },
        {
          data: (data, type, dataToSet) => {
            return data.useYn ? "Yes" : "No";
          },
          className: "center", width: "3%"
        },
        { data: "remark", width: "14%" }
      ],
      pageLength: 25,
      scrollX: true,
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.loadDataTable();
            this.settingReset();
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
              var selectedText: string = rowSelected.itemDsplNm;
              this.notification.confirmDialog(
                "Delete Routing Master Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.itemMasterService.deleteItem(rowSelected.itemCd).then(data => {
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

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    setTimeout(() => {
      this.detailInfo = Object.assign({}, event);
      this.entryDate = CommonFunction.formatDate(this.detailInfo.createdTime);
      (<HTMLInputElement>document.getElementById("stock-unit-selected-1")).textContent = this.stockUnits.find(x => x.gen_cd == this.detailInfo.stockUnitGenCd).gen_nm;
      (<HTMLInputElement>document.getElementById("stock-unit-selected-2")).value = this.stockUnits.find(x => x.gen_cd == this.detailInfo.stockUnitGenCd).gen_nm;
      this.itemizeds.find(x => x.gen_cd == this.detailInfo.itemizedGenCd).ck_value_1 == "3" ? this.setEnableProFlowDropdown() : this.setDisProFlowDropdown();     
      this.cdr.detectChanges();
    }, 100);
  }

  onSubmit() {
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.bizUnitId = parseInt(this.detailInfo.bizUnitId.toString());
    let table = $('.tableGetMaterial').DataTable();
    if (this.detailInfo.itemCd === '') {
      this.itemMasterService.insertItem(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          //this.reloadDatatable();
          //Set focus new row was created
          this.detailInfo.itemSeq = data.data.itemSeq;
          this.detailInfo.itemCd = data.data.itemCd;
          this.detailInfo.createdTime = CommonFunction.formatDate(data.data.createdTime);
          this.detailInfo.changedTime = data.data.changedTime;
          let data_temp = table.data().sort().reverse();
          data_temp.push(this.detailInfo);
          table.clear();
          table.rows.add(data_temp.sort().reverse()).draw();
          table.rows(0).select();
        }
      });
    } else {
      this.itemMasterService.updateItem(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  onReset() {
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.settingReset();
  }

  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
    this.loadDataTable();
  }

  private loadDataTable(){
    return this.itemMasterService.listItemMasterAll().then(rs => {
      rs.sort(function (a, b) {
        return b.itemSeq - a.itemSeq;
      });
      var table = $('.tableGetMaterial').DataTable();
      table.clear();
      table.rows.add(rs).draw();
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  onCheckSale(event) {
    $("#price").attr('disabled', !event.target.checked);
    if (event.target.checked) {
      $("#background-price-disabled").removeClass("state-disabled");
    } else {
      $("#background-price-disabled").addClass("state-disabled");
    }
  }

  closeSupplierPopup() {
    this.modalRef && this.modalRef.hide();
  }

  private getItemizeds() {
    return this.generalMasterService.listGeneralItemizedByItem();
  }

  private getGlobalUnits() {
    return this.globalMasterService.listGlobalByType();
  }

  private getItemCategories() {
    return this.generalMasterService.listGeneralByCate(Category.ItemCategory.valueOf());
  }

  private getStockUnits() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }

  private getPackUnits() {
    return this.generalMasterService.listGeneralByCate(Category.PackUnitCode.valueOf());
  }

  private getProcessFlows() {
    return this.processFlowMasterService.getAllProcessFlow2(0, 0);
  }

  private getStandards() {
    return this.generalMasterService.listGeneralByCate(Category.Standard.valueOf());
  }

  private getSizes() {
    return this.generalMasterService.listGeneralByCate(Category.Size.valueOf());
  }

  private getBrands() {
    return this.generalMasterService.listGeneralByCate(Category.Brand.valueOf());
  }

  private settingReset() {
    this.detailInfo = new ItemMasterModel();
    this.cdr.detectChanges();
    this.detailInfo.creator = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    (<HTMLInputElement>document.getElementById("stock-unit-selected-1")).textContent = '';
    (<HTMLInputElement>document.getElementById("stock-unit-selected-2")).value = '';
    this.setDisProFlowDropdown();
  }

  private setDisProFlowDropdown() {
    (<HTMLInputElement>document.getElementById("process-flow-Id")).disabled = true;
    (<HTMLInputElement>document.getElementById("process-flow-Id")).classList.remove("required");
  }

  private setEnableProFlowDropdown() {
    (<HTMLInputElement>document.getElementById("process-flow-Id")).disabled = false;
    (<HTMLInputElement>document.getElementById("process-flow-Id")).classList.add("required");
  }
}
