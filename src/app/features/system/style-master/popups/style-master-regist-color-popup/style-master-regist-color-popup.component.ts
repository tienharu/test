import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CustomerMaterialModel } from '@app/core/models/customer-material.model';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { StyleMasterColorModel } from '@app/core/models/style-master-color-model';
import _ from "lodash";

@Component({
  selector: 'sa-style-master-regist-color-popup',
  templateUrl: './style-master-regist-color-popup.component.html',
  styleUrls: ['./style-master-regist-color-popup.component.css']
})
export class StyleMasterRegistColorPopupComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  cate_cd: number;
  customerId: string = '';
  customerInfo: CustomerMaterialModel;
  isDisable: boolean = false;
  options_popup: any;
  cateId: any;
  isFilterGrid: boolean = true;
  userLogin: any;
  //-----------------------------------------
  detailInfo: StyleMasterColorModel;
  masStyle : any;
  @Input() ParentInfo: string;
  @ViewChild("popupSupplierInformation") popupSupplierInformation;
  @Output() childCall = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    public styleMasterService: StyleMasterService,
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
      colorName: {
        required: true
      }
  
    },
    // Messages for form validation
    messages: {
      colorName: {
        required: "Please enter color name"
      }
    }
  };
  ngOnInit() {
    this.detailInfo = this.styleMasterService.getStyleMasterColorModel();
     this.masStyle  = JSON.parse(this.ParentInfo);
    this.onReset();
    this.initDatatable();
    this.detailInfo.styleSysId = this.masStyle.styleSysId;
    this.detailInfo.companyId = this.masStyle.companyId;
    this.detailInfo.companyId = this.loggedUser.company_id;
    setTimeout(() => {
      this.reloadDatatable();
    }, 200);
  }
  onCateChange(cateId) {
    if (this.isFilterGrid)
      $('select[name="filter_cate_cd"]').val(cateId).trigger('change');
  }
  private initDatatable() {
    this.options_popup = {
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
          }, className: "center", width: "10%"
        },
        // { data: "colorId", width: "25%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            return data.colorType === true ? "Style" : "Construction";
          },
          className: "left", width: "25%"
        },
        { data: "colorName", width: "25%", className: "center" },
        { data: "colorId", width: "15%", className: "center" },
        { data: "remark", width: "25%", className: "left" },
      ],
      pageLength: 15,
      bSort: false,
      scrollX: true,
      scrollY: true,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.loadDataTable();
            this.detailInfo = new StyleMasterColorModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            // if (!this.permission.canDelete) {
            //   this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
            //   return;
            // }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.colorName;
              this.notification.confirmDialog(
                "Delete Regist Color!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.styleMasterService.deleteStyleMasterColor(this.detailInfo.colorId).then(data => {
                      if (!data.success) {
                        this.notification.showMessage("error", data.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          "Deleted successfully"
                        );
                        this.reloadDatatable();
                        this.detailInfo = new StyleMasterColorModel;
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
    var f = $("form.frm-detail_popup").validate();
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
    this.detailInfo.styleSysId = this.masStyle.styleSysId;
    this.detailInfo.companyId = this.masStyle.companyId;
    if (this.detailInfo.colorId == 0) {
      this.styleMasterService.insertStyleMasterColor(this.detailInfo).then(data => {
        if (data.error) {
          if (data.error.code === 403) {
            // this.modalService.hide(1);
            this.router.navigate(["/error/error403"]);
          }
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          // this.modalService.hide(1);
          this.reloadDatatable();
          this.childCall.emit('reload-regist-color-data');
        }
      });
    }
    else {
      this.styleMasterService.updateStyleMasterColor(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.childCall.emit('reload-regist-color-data');
          this.reloadDatatable();
        }
      });
    }
  }

  onReset() {
    $("form.frm-detail_popup").validate().resetForm();
    this.detailInfo = new StyleMasterColorModel();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }
  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
    this.loadDataTable();
  }
  private loadDataTable() {
    if(this.masStyle.styleSysId && this.masStyle.styleSysId !== 0){
      return this.styleMasterService.getStyleMasterColorByStyle(this.masStyle.styleSysId).then(rs => {
        rs.data.sort(function (a, b) {
          return b.colorId - a.colorId;
        });
        var table = $('.color_table').DataTable();
        table.clear();
        table.rows.add(rs.data).draw();
      });
    }
  }
}
