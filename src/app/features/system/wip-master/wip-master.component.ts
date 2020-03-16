import { Component, OnInit, Input } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { Observable } from 'rxjs';
import { WipMasterModel } from '@app/core/models/wip-master.model';
import { WipMasterService } from '@app/core/services/features.services/wip-master.service';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CommonFunction } from '@app/core/common/common-function';
import { RoutingMasterService } from '@app/core/services/features.services/routing-master.service';
import { RoutingMasterModel } from '@app/core/models/routing-master.model';
import { TraderModel } from '@app/core/models/trader.model';

@Component({
  selector: 'sa-wip-master',
  templateUrl: './wip-master.component.html',
  styleUrls: ['./wip-master.component.css']
})
export class WipMasterComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  detailInfo: WipMasterModel = new WipMasterModel();
  itemizeds: GeneralMasterModel[] = [];
  bizUnits: GlobalMasterModel[] = [];
  stockUnits: GeneralMasterModel[] = [];
  routingInfoes: RoutingMasterModel[] = [];


  //--------------------------------------------Add funtion to the right
  traderInfo: TraderModel;
  @Input() traderId: number;
  //--------------------------------------------
  options: any;
  cateId: any;
  isFilterGrid: boolean = true;




  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public wipMasterService: WipMasterService,
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

  ngOnInit() {

    this.checkPermission(ProgramList.Mas_WIP.valueOf());
    this.detailInfo = this.wipMasterService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.initDatatable()
    return Promise.all([
      this.getItemized(),
      this.getBizUnit(),
      this.getStockUnit(),
      this.getRouting(),
    ]).then(res => {
      this.itemizeds.push(...res[0]);
      this.bizUnits.push(...res[1]);
      this.stockUnits.push(...res[2]);
      this.routingInfoes.push(...res[3]);
      this.loadDataTable();
    });

  }

  private getCategories() {
    return this.generalMasterService.listGeneralCategory();
  }

  onCheckSale(event) {
    //console.log("event", event.target.checked);

    $("#price").attr('disabled', !event.target.checked);
    if (event.target.checked) {
      $("#background-price-disabled").removeClass("state-disabled");
    } else {
      $("#background-price-disabled").addClass("state-disabled");
    }
  }
  private loadDataTable() {
    //console.log("vao dc het all");
    return this.wipMasterService.listWipMasterAll().then(rs => {
      rs.sort(function (a, b) {
        return b.wipSeq - a.wipSeq;
      });
      var table = $('.tableGetWip').DataTable();
      table.clear();
      table.rows.add(rs).draw();
    });
  }

  private getParents(value) {
    return new Promise<any>((resolve, reject) => {
      // this.api.get(`sysgeneral/details/catecd/${value}`).subscribe(data => {
      //   resolve(data.data);
      // });

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
        // this.generalMasterService.listSystemGeneral().then(data => {
        //   callback({
        //     aaData: []
        //   });
        // });
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
        {
          data: (data, type, dataToSet) => {
            // console.log(data);
            // console.log(this.bizUnits);
            var o = this.bizUnits.filter(x => x.global_unit_id === data.bizUnitId);
            if (o.length > 0) return o[0].global_unit_nm;
            else return "N/A";
          }, class: "left", width: "10%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.itemizeds.filter(x => x.gen_cd === data.itemizedGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "left", width: "10%"
        },

        {
          data: (data, type, dataToSet) => {
            var o = this.routingInfoes.filter(x => x.routeId === data.routeId);
            if (o.length > 0) return o[0].routeName;
            else return "N/A";
          }, class: "left", width: "10%"
        },
        { data: "wipFullNm", class: "left", width: "10%" },
        {
          data: (data, type, dataToSet) => {
            var o = this.stockUnits.filter(x => x.gen_cd === data.stockUnitGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "5%"
        },
        { data: "expiryDays", width: "5%", className: "center" },

        {
          data: (data, type, dataToSet) => {
            return data.outsourcingYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.semiProdYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.mixYn ? "Yes" : "No";
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
            return data.changeOrderYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.useYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },

        { data: "remark", width: "15%", className: "left" },

      ],
      pageLength: 25,
      scrollX: true,
      scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.loadDataTable();
            this.settingReset();
            this.detailInfo = new WipMasterModel();
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
              var selectedText: string = rowSelected.wipFullNm;
              this.notification.confirmDialog(
                "Delete wip Master Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.wipMasterService.deleteWip(rowSelected.wipCd).then(data => {
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

      if (this.detailInfo.salesYn) {
        $("#price").attr('disabled', false);
        $("#background-price-disabled").removeClass("state-disabled");
      } else {
        $("#price").attr('disabled', true);
        $("#background-price-disabled").addClass("state-disabled");
      }

    }, 100);
    this.isFilterGrid = false;
    let value = event.cate_cd;
    //this.onGetParent(value,event);     
    setTimeout(() => {
      this.detailInfo = event;
    }, 10);

    setTimeout(() => {
      this.isFilterGrid = true;
    }, 200);
  }

  onSubmit() {
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.changedTime = new Date().toString('yyyy.MM.dd');
    this.detailInfo.createdTime = new Date().toString('yyyy.MM.dd');
    let table = $('.tableGetWip').DataTable();
    this.detailInfo.bizUnitId = parseInt(this.detailInfo.bizUnitId.toString());
    // this.detailInfo.routeId = parseInt(this.detailInfo.routeId.toString());
    console.log("gia tri route id : ",this.detailInfo);   
    if (this.detailInfo.wipCd === '') {
      this.wipMasterService.insertWip(this.detailInfo).then(data => {
        //console.log("data", data);

        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          // this.detailInfo.routeId = parseInt(this.detailInfo.routeId.toString());
          this.notification.showMessage("success", data.message);
          let data_temp = table.data().sort().reverse();
          data_temp.push(this.detailInfo);
          table.clear();
          table.rows.add(data_temp.sort().reverse()).draw();
          table.rows(0).select();
          this.detailInfo.wipCd = data.data.wipCd;
          this.detailInfo.createdTime = CommonFunction.formatDate(data.data.createdTime);
          this.detailInfo.changedTime = data.data.changedTime;
          this.detailInfo.wipSeq = data.data.wipSeq;
        }
      });
    } else {
      this.wipMasterService.updateWip(this.detailInfo).then(data => {
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
    this.isFilterGrid = true;
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.settingReset();
    this.detailInfo = new WipMasterModel();
  }

  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
    this.loadDataTable();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
  private getItemized() {
    return this.wipMasterService.listGeneralItemized();
  }
  private getBizUnit() {
    return this.wipMasterService.listGlobalByType();
  }
  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }
  private getRouting() {
    return this.wipMasterService.listRouting();
  }
  private settingReset() {
    this.detailInfo = new WipMasterModel();
    //this.cdr.detectChanges();
    this.detailInfo.creator = this.loggedUser.user_name;
    // this.entryDate = new Date().toString('yyyy-MM-dd');
    // (<HTMLInputElement>document.getElementById("stock-unit-selected")).value = '';
    $("#price").attr('disabled', true);
    $("#background-price-disabled").addClass("state-disabled");
  }
  sharingToSelected(data) {
   // console.log("data",data)
    this.detailInfo.sharing_to = data;
    //console.log('sharingToSelected',this.traderInfo.sharing_to)
  }
}
