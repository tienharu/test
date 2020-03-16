import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { Observable } from 'rxjs';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { RoutingMasterModel } from '@app/core/models/routing-master.model';
import { RoutingMasterService } from '@app/core/services/features.services/routing-master.service';
import _ from "lodash";
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'sa-routing-master',
  templateUrl: './routing-master.component.html',
  styleUrls: ['./routing-master.component.css']
})
export class RoutingMasterComponent extends BasePage implements OnInit {
  stockUnits: GeneralMasterModel[] = [];
  routingClasses: GeneralMasterModel[] = [];
  locations: GeneralMasterModel[] = [];
  detailInfo: RoutingMasterModel;
  options: any;
  entryDate: any = '';
  defaultInventoryUnit: string = '';
  defaultRoutingClass: string = '';
  defaultLocation: string = '';

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    public routingMasterService: RoutingMasterService,
    private i18nService: I18nService,
    private generalMasterService: GeneralMasterService,
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
    // this.checkPermission(ProgramList.Mas_Routing.valueOf());
    this.detailInfo = this.routingMasterService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    this.initDatatable();
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      // "bLengthChange" : false, // hidden show entries
      // "bSort":false,
      ajax: (data, callback, settings) => {
        this.routingMasterService.listRoutingMasterAll().then(data => {
          data.sort(function (a, b) {
            return b.routeSeq - a.routeSeq;
          });
          data = _.map(data, function (item, index) {
            item.index = index + 1;
            return item;
          });
          if (this.stockUnits.length == 0 || this.routingClasses.length == 0 || this.locations.length == 0) {
            Promise.all([
              this.getStockUnit(),
              this.getRoutingClass(),
              this.getLocations(),
            ]).then(res => {
              this.stockUnits.push(...res[0]);
              this.routingClasses.push(...res[1]);
              this.locations.push(...res[2]);
              callback({
                aaData: data
              });
            });
          } else {
            callback({
              aaData: data
            });
          }
        });
      },
      columns: [
        { data: "index", className: "center", width: "5%" },
        { data: "routeName", width: "18%" },
        { data: "routeSeq", class: "center", width: "8%" },
        {
          data: (data, type, dataToSet) => {
            var o = this.routingClasses.filter(x => x.gen_cd === data.routeClassGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "12%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.stockUnits.filter(x => x.gen_cd === data.stockUnitGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "8%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.locations.filter(x => x.gen_cd === data.locationGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "17%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.outprocessYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.useYn ? "Yes" : "No";
          },
          className: "center", width: "5%"
        },
        { data: "remark", width: "22%" }
      ],
      pageLength: 25,
      scrollX: true,
      // // scrollY: 350,
      // // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
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
              var selectedText: string = rowSelected.route_name;
              this.notification.confirmDialog(
                "Delete Routing Master Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.routingMasterService.deleteRouting(rowSelected.routeId).then(data => {
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
      this.defaultInventoryUnit = this.detailInfo.stockUnitGenCd;
      this.defaultRoutingClass = this.detailInfo.routeClassGenCd;
      this.defaultLocation = this.detailInfo.locationGenCd;
      this.entryDate = CommonFunction.formatDate(this.detailInfo.createdTime);
    }, 100);
  }

  onSubmit() {
    this.detailInfo.companyId = this.loggedUser.company_id;
    if (this.detailInfo.routeId === '') {
      this.routingMasterService.insertRouting(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          // this.reloadDatatable();
          //set selected for new row
         this.realoadAndSetFocusRow(data);
          this.detailInfo.routeId = data.data.routeId;
          this.detailInfo.createdTime = CommonFunction.formatDate(data.data.createdTime);
          this.detailInfo.changedTime = data.data.changedTime;
        }
      });
    } else {
      this.routingMasterService.updateRouting(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          //this.reloadDatatable();
          //set selected for new row
          this.realoadAndSetFocusRow(data);
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
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  private getStockUnit() {
    return this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf());
  }

  private getRoutingClass() {
    return this.generalMasterService.listGeneralByCate(Category.RoutingClassCateCode.valueOf());
  }

  private getLocations() {
    return this.generalMasterService.listGeneralByCate(Category.LocationCateCode.valueOf());
  }

  private settingReset() {
    this.detailInfo = new RoutingMasterModel();
    this.defaultInventoryUnit = "";
    this.defaultRoutingClass = "";
    this.defaultLocation = "";
    this.cdr.detectChanges();
    this.detailInfo.creator = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
  }

  private realoadAndSetFocusRow(data: any){
    $(".dataTable")
    .DataTable()
    .ajax.reload(() => {
      var table = $('.dataTable').DataTable();
      var indexes = table.rows().eq(0).filter(function (rowIdx) {
        return table.cell(rowIdx, 2).data() == data.data.routeId;
      });
      table.rows(indexes).select();
    });
  }
}
