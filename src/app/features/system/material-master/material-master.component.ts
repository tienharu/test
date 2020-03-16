import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { MaterialMasterModel } from '@app/core/models/material-master-model';
import { MaterialMasterService } from '@app/core/services/features.services/material-master-service';
import { CommonFunction } from '@app/core/common/common-function';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';

@Component({
  selector: 'sa-material-master',
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.css']
})
export class MaterialMasterComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  cate_cd: number;
  detailInfo: MaterialMasterModel = new MaterialMasterModel();
  masOrigins: GeneralMasterModel[] = [];
  stockUnits: GeneralMasterModel[] = [];
  packUnits: GeneralMasterModel[] = [];
  specMasters: GeneralMasterModel[] = [];
  properties: GeneralMasterModel[] = [];
  itemizeds: GeneralMasterModel[] = [];
  bizUnits: GlobalMasterModel[] = [];
  entryDate: any = '';
  entryUser: string = '';
  defaultOrigin: string = '';
  defaultStockUnit: string = '';
  defaultPackUnits: string = '';
  defaultSpec: string = '';

  options: any;
  cateId: any;
  @ViewChild("popupSupplierInformation") popupSupplierInformation;
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public materialMasterService: MaterialMasterService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
    private globalMasterService: GlobalMasterService,
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
    this.checkPermission(ProgramList.Mas_Material.valueOf());
    this.detailInfo = this.materialMasterService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.entryUser = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    this.initDatatable();
    //Set Unit of Price
    $("#stock-unit-select").on("select2:select", function (e) {
      (<HTMLInputElement>document.getElementById("stock-unit-selected")).value = e.params.data.text;
    });
    return Promise.all([
      this.getMasOrigin(),
      this.getPackUnit(),
      this.getStockUnit(),
      this.getSpec(),
      this.getProperty(),
      this.getItemized(),
      this.getBizUnit()
    ]).then(res => {
      this.masOrigins.push(...res[0]);
      this.packUnits.push(...res[1]);
      this.stockUnits.push(...res[2]);
      this.specMasters.push(...res[3]);
      this.properties.push(...res[4]);
      this.itemizeds.push(...res[5]);
      this.bizUnits.push(...res[6]);
      this.loadDataTable();
    });
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        // this.materialMasterService.listMaterialMasterAll().then(data => {
        //   data.sort(function (a, b) {
        //     return b.materialSeq - a.materialSeq;
        //   });
        //   // if (this.masOrigins.length == 0 || this.packUnits.length == 0 || this.stockUnits.length == 0 ||
        //   //     this.specMasters.length == 0 || this.properties.length == 0 || this.itemizeds.length == 0 || this.bizUnits.length == 0) {
        //   //       callback({
        //   //         aaData: data
        //   //       });
        //   // } else {
        //   //   callback({
        //   //     aaData: data
        //   //   });
        //   // }
        //   callback({
        //     aaData: data
        //   });
        // });
        callback({
          aaData: []
        });
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            var o = this.itemizeds.filter(x => x.gen_cd === data.itemCateGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "10%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.bizUnits.filter(x => x.global_unit_id == data.bizUnitId);
            if (o.length > 0) return o[0].global_unit_nm;
            else return "N/A";
          }, class: "center", width: "8%"
        },
        { data: "materialFullNm", width: "12%" },
        { data: "materialDsplNm", width: "12%" },
        {
          data: (data, type, dataToSet) => {
            var o = this.stockUnits.filter(x => x.gen_cd === data.stockUnitGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "5%"
        },
        { data: "expiryMonth", width: "5%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var o = this.specMasters.filter(x => x.gen_cd === data.specGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "12%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.comomMaterialYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.outsourcingYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.salesYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.useYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        { data: "remark", width: "16%" },

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
              var selectedText: string = rowSelected.materialDsplNm;
              this.notification.confirmDialog(
                "Delete Routing Master Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.materialMasterService.deleteMaterial(rowSelected.materialCd).then(data => {
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
      if (this.detailInfo.salesYn) {
        $("#price").attr('disabled', false);
        $("#background-price-disabled").removeClass("state-disabled");
      } else {
        $("#price").attr('disabled', true);
        $("#background-price-disabled").addClass("state-disabled");
      }
      (<HTMLInputElement>document.getElementById("stock-unit-selected")).value = this.stockUnits.find(x => x.gen_cd == this.detailInfo.stockUnitGenCd).gen_nm;
    }, 100);

  }

  onSubmit() {
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.bizUnitId = parseInt(this.detailInfo.bizUnitId.toString());
    let table = $('.tableGetMaterial').DataTable();
    if (this.detailInfo.materialCd === '') {
      this.materialMasterService.insertMaterial(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          //this.reloadDatatable();
          //Set focus new row was created
          let data_temp = table.data().sort().reverse();
          data_temp.push(this.detailInfo);
          table.clear();
          table.rows.add(data_temp.sort().reverse()).draw();
          table.rows(0).select();
          this.detailInfo.materialCd = data.data.materialCd;
          this.detailInfo.createdTime = CommonFunction.formatDate(data.data.createdTime);
          this.detailInfo.changedTime = data.data.changedTime;
          this.detailInfo.materialSeq = data.data.materialSeq;
        }
      });
    } else {
      this.materialMasterService.updateMaterial(this.detailInfo).then(data => {
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
    return this.materialMasterService.listMaterialMasterAll().then(rs => {
      rs.sort(function (a, b) {
        return b.materialSeq - a.materialSeq;
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

  showPopupSupplier($event) {
    var f = $("form.frm-detail").validate();
    if (Object.keys(f.invalid).length !== 0) {
      return;
    };

    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.modalRef = this.modalService.show(this.popupSupplierInformation, config);
  }

  closeSupplierPopup() {
    this.modalRef && this.modalRef.hide();
  }

  private getMasOrigin() {
    return this.generalMasterService.listGeneralByCate(Category.MasOriginCode.valueOf());
  }
  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }
  private getPackUnit() {
    return this.generalMasterService.listGeneralByCate(Category.PackUnitCode.valueOf());
  }
  private getSpec() {
    return this.generalMasterService.listGeneralByCate(Category.SpecCode.valueOf());
  }

  private getProperty() {
    return this.generalMasterService.listGeneralByCate(Category.MaterialProperty.valueOf());
  }

  private getItemized() {
    return this.generalMasterService.listGeneralItemizedByMaterial();
  }

  private getBizUnit() {
    return this.globalMasterService.listGlobalByType();
  }

  private settingReset() {
    this.detailInfo = new MaterialMasterModel();
    this.cdr.detectChanges();
    this.detailInfo.creator = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    (<HTMLInputElement>document.getElementById("stock-unit-selected")).value = '';
    $("#price").attr('disabled', true);
    $("#background-price-disabled").addClass("state-disabled");
  }
}


