import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { MaterialMasterPopupModel } from '@app/core/models/material-master-popup.model';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { MaterialMasterPopupService } from '@app/core/services/features.services/material-master-popup.service';
import { CustomerMaterialModel } from '@app/core/models/customer-material.model';
import _ from "lodash";
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'sa-material-master-popup',
  templateUrl: './material-master-popup.component.html',
  styleUrls: ['./material-master-popup.component.css']
})
export class MaterialMasterPopupComponent extends BasePage implements OnInit {
  opportunityInfo: CrmSalesOpportunityModel;
  adminInChage: any[] = [];

  modalRef: BsModalRef;
  cate_cd: number;
  detailInfo: MaterialMasterPopupModel;
  procureTypes: GeneralMasterModel[] = [];
  suppliers: CustomerMaterialModel[] = [];
  stockUnits: GeneralMasterModel[] = [];
  customerId: string = '';
  customerInfo: CustomerMaterialModel;
  isDisable: boolean = false;

  purchasePrice: any;
  pakageUnit: any;
  loss: any;
  MinPOQty: any;
  leadTime: any;
  materialFullName: string = "";
  entryDate: any = '';
  entryUser: string = ''
  packingUnit: string = '';
  customerSeq: number = 0;
  @Input() ParentInfo: string;

  options_popup: any;
  cateId: any;
  isFilterGrid: boolean = true;
  @ViewChild("popupSupplierInformation") popupSupplierInformation;
  userLogin: any;
  @Output() childCall = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public materialMasterPopupService: MaterialMasterPopupService,
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
      // cate_cd: {
      //   required: true
      // },
      // procureTypeGenCd: {
      //   required: true
      // },
      // leadTimeDays: {
      //   required: true
      // },
      // minPoQty: {
      //   required: true
      // },
      // purchPrice: {
      //   required: true
      // },
      // packingUnitQty: {
      //   required: true
      // },
      // lossRatio: {
      //   required: true
      // },
      // customerCd: {
      //   required: true
      // }
    },
    // Messages for form validation
    messages: {
      // cate_cd: {
      //   required: "Please select the category"
      // },
      // procureTypeGenCd: {
      //   required: "Please enter the procureTypeGenCd"
      // },
      // leadTimeDays: {
      //   required: "Please select the leadTimeDays"
      // },
      // minPoQty: {
      //   required: "Please enter the minPoQty"
      // },
      // purchPrice: {
      //   required: "Please enter the purchPrice"
      // },
      // packingUnitQty: {
      //   required: "Please enter the packingUnitQty"
      // },
      // lossRatio: {
      //   required: "Please enter the lossRatio"
      // },
      // customerCd: {
      //   required: "Please select Supplier"
      // }
    }
  };


  ngOnInit() {
    let material = JSON.parse(this.ParentInfo);
    this.isDisable = false;
    this.checkPermission(ProgramList.Mas_Material.valueOf());
    this.detailInfo = this.materialMasterPopupService.getModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.entryUser = this.loggedUser.user_name;
    this.entryDate = new Date().toString('yyyy-MM-dd');
    // this.getProcureType().then(data => {
    //   this.procureTypes.push(...data);
    // });
    // this.getCustomer().then(data => {
    //   this.suppliers.push(...data);
    // });
    this.onReset();
    // console.log("customer", this.suppliers);
    this.initDatatable();

    if (!material || material.materialCd == "") {
      this.isDisable = true;
    }
    else {
      this.isDisable = false;
      this.detailInfo.materialCd = material.materialCd;
      this.materialFullName = material.materialFullNm;
      this.generalMasterService.listGeneralByCate(Category.StockUnitCode.valueOf()).then(data => {
        this.stockUnits.push(...data);
        this.packingUnit = this.stockUnits.find(x => x.gen_cd == material.stockUnitGenCd).gen_nm;
      });
    }
    return Promise.all([
      this.getProcureType(),
      this.getCustomer()
    ]).then(res => {
      this.procureTypes.push(...res[0]);
      this.suppliers.push(...res[1]);
      this.reloadDatatable();
    });
  }

  onCateChange(cateId) {
    if (this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }

  private initDatatable() {
    this.options_popup = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.materialMasterPopupService.listMaterialMasterPopupAll().then(data => {
          callback({
            aaData: data
          });
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
            return CommonFunction.formatDate(data.createdTime);
          }, class: "center", width: "15%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.suppliers.filter(x => x.customer_cd === data.customerCd);
            if (o.length > 0) return o[0].trader_local_nm;
            else return "N/A";
          }, width: "15%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.procureTypes.filter(x => x.gen_cd === data.procureTypeGenCd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, class: "center", width: "10%"
        },
        { data: "purchPrice", width: "10%", className: "center" },
        { data: "lossRatio", width: "10%", className: "center" },
        { data: "minPoQty", width: "10%", className: "center" },
        { data: "leadTimeDays", width: "10%", className: "center" },
        { data: "remark", width: "15%", className: "center" },

      ],
      pageLength: 15,
      bSort: false,
      scrollX: true,
      // scrollY: 350,
      // paging: false,
      buttons: [
        // {
        //   text: '<i class="fa fa-refresh" title="Refresh"></i>',
        //   action: (e, dt, node, config) => {
        //     dt.ajax.reload();
        //     this.detailInfo = new GeneralMasterModel();
        //   }
        // },
        // "copy",
        // "excel",
        // "pdf",
        // "print"
      ]
    };
  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    this.isFilterGrid = false;
    let value = event.cate_cd;    
    setTimeout(() => {
      this.detailInfo = event;
    }, 10);

    setTimeout(() => {
      this.isFilterGrid = true;
    }, 200);

  }

  onSubmit() {
    if (this.detailInfo.bmMasPurchMasterCd === '') {
      this.materialMasterPopupService.insertMaPopUp(this.detailInfo).then(data => {
        if (data.error) {
          if (data.error.code === 403) {
            this.modalService.hide(1);
            this.router.navigate(["/error/error403"]);
          }
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          //this.modalService.hide(1);
          this.reloadDatatable();
          this.childCall.emit();
        }
      });
    }
    else {
      this.materialMasterPopupService.updateMaPopUp(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  onCustomerChange(value) {
    this.customerSeq = this.suppliers.find(x => x.customer_cd == this.detailInfo.customerCd).customer_seq;
  }

  getDataTableDetail(cusId) {
    this.materialMasterPopupService.getDetail(cusId, true).then(data => {
      this.detailInfo = data;
    })
  }
  reloadData() {
    this.getDataTableDetail(this.customerId);
  }
  onReset() {
    $("form.frm-detail_popup")
      .validate()
      .resetForm();
    this.detailInfo = new MaterialMasterPopupModel();
  }

  private reloadDatatable() {
    $(".dataTable.table_popup")
      .DataTable()
      .ajax.reload();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }

  private getProcureType() {
    return this.generalMasterService.listGeneralByCate(Category.ProcureTypeCode.valueOf());
  }
  private getCustomer() {
    return this.materialMasterPopupService.getCustomer();
  }
}
