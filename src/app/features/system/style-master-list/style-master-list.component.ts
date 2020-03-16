import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { Observable } from 'rxjs';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { StyleMasterModel } from '@app/core/models/style-master-model';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ProgramModel } from '@app/core/models/program.model';
import _ from 'lodash';
import * as moment from 'moment';
import { CommonFunction } from '@app/core/common/common-function';
@Component({
  selector: 'sa-style-master-list',
  templateUrl: './style-master-list.component.html',
  styleUrls: ['./style-master-list.component.css']
})
export class StyleMasterListComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GeneralMasterModel[] = [];
  options: any;
  cateId: any;
  isFilterGrid: boolean = true;
  listStyleMaster: StyleMasterModel[] = [];
  detailInfo: StyleMasterModel;
  traderList: any = [];
  buyers: any = [];
  styleTypes: any = [];
  styleCategories: any = [];
  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public styleMasterService: StyleMasterService,
    private traderService: TraderService,
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
    this.checkPermission(ProgramList.Style_Master_List.valueOf());
    this.detailInfo = this.styleMasterService.getStyleMasterModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.initDatatable()
    return Promise.all([
      this.getAllListStyle(),
      this.getAllTrader(),
      this.getStyleCategories(),
      this.getStyleTypes()
    ]).then(res => {
      this.listStyleMaster.push(...res[0]);
      this.traderList.push(...res[1]);
      this.buyers = _.filter(this.traderList, function (item) {
        return (item.type_gen_cd + '') === '170100110000';
      });
      this.styleCategories.push(...res[2]);
      this.styleTypes.push(...res[3]);
      this.loadDataTable();
    });
  }
  private loadDataTable() {
    return this.styleMasterService.getAllStyle().then(rs => {
      if (rs) {
        rs.sort(function (a, b) {
          return b.styleSysId - a.styleSysId;
        });
      }
      var table = $('.styleMasterList').DataTable();
      table.clear();
      table.rows.add(rs).draw();
    });
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
        { data: "styleNo", class: "center", width: "5%" },
        { data: "styleName", class: "center", width: "10%" },
        {
          data: (data, type, dataToSet) => {
            var o = this.buyers.filter(x => x.trader_id === data.buyerCd);
            if (o.length > 0) return o[0].trader_local_nm;
            else return "N/A";
          }, class: "left", width: "10%"
        },
        { data: "orderRecvYmd", class: "center", width: "10%" },
        { data: "orderQty", class: "center", width: "5%" },
        { data: "price", class: "right", render: $.fn.dataTable.render.number(',') },
        {
          data: (data, type, dataToSet) => {
            let amount = CommonFunction.FormatCurrency(data.orderQty) * CommonFunction.FormatCurrency(data.price);
            return amount;
          }, class: "right", render: $.fn.dataTable.render.number(',')
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.styleCategories.filter(x => x.gen_cd === data.styleCategoryGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "left", width: "10%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.styleCategories.filter(x => x.gen_cd === data.styleCategoryGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "left", width: "10%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.closedYmd ? moment(data.closedYmd).format('YYYY.MM.DD') : '';
          }, width: "10%", className: "center"
        },
        {
          data: (data, type, dataToSet) => {
            return data.cancelYmd ? moment(data.cancelYmd).format('YYYY.MM.DD') : '';
          }, width: "10%", className: "center"
        },
        { data: "remark", width: "20%", className: "left" },
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
            this.detailInfo = new StyleMasterModel();
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
                    // this.styleMasterService.deleteWip(rowSelected.wipCd).then(data => {
                    //   if (!data.success) {
                    //     this.notification.showMessage("error", data.message);
                    //   } else {
                    //     this.notification.showMessage(
                    //       "success",
                    //       "Deleted successfully"
                    //     );
                    //     this.reloadDatatable();
                    //   }
                    // })
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
    this.openStyleMasterDetail(event);
  }

  openStyleMasterDetail(item) {

    $(window.parent.document).find(".center-loading").show();
    var self = this;
    var url = 'style-master/' + item.styleSysId;
    var id = ProgramList.Style_Master.valueOf();
    this.programService.addOpenedPrograms(new ProgramModel(id, 'STYLE-MASTER', url));
    var $page = $(window.parent.document).find("#page");
    var ie = $page.find("iframe[id=" + id + "]");
    if (ie.length) {
      ie.remove();
    }
    $page.find("iframe").hide();
    $('<iframe>', {
      src: "/#/" + url,
      id: id,
      frameborder: 0,
      scrolling: 'auto',
      height: '100vh',
      width: '100%'
    }).appendTo($page);

    var $footer = $(window.parent.document).find("#tabs");
    $footer.find('li').removeClass('active');
    var liFooter = $footer.find("li[id=" + id + "]");
    if (liFooter.length) {
      liFooter.addClass('active');
    } else {
      $footer.append('<li class="active styleMasterDetail-active-tab" url="' + url + '" styleMasterDetail="' + id + '" id="' + id + '"><a class="styleMasterDetail-active-tab" url="' + url + '" styleMasterDetail="' + id + '"><i class="fa fa-times styleMasterDetail-close-tab" styleMasterDetail="' + id + '" style="cursor: pointer"></i>&nbsp;Style Master Detail</a></li>')
    }
  }
  onReset() {
    this.isFilterGrid = true;
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.detailInfo = new StyleMasterModel();
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
  private getAllListStyle() {
    return this.styleMasterService.getAllStyle();
  }
  private getAllTrader() {
    return this.traderService.ListTrader(this.companyInfo.company_id);
  }
  private getStyleCategories() {
    return this.generalMasterService.listGeneralByCate(Category.StyleCategory.valueOf());
  }

  private getStyleTypes() {
    return this.generalMasterService.listGeneralByCate(Category.StyleType.valueOf());
  }
  sharingToSelected(data) {
  }
}
