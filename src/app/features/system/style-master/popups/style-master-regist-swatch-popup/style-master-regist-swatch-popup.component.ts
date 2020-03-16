import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer, ElementRef } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category } from '@app/core/common/static.enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { CustomerMaterialModel } from '@app/core/models/customer-material.model';
import { CommonFunction } from '@app/core/common/common-function';
import { DownloadImageService } from '@app/core/services/download-image.service';

import { StyleMasterSwatchModel } from '@app/core/models/style-master-swatch-model';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import _ from "lodash";

@Component({
  selector: 'sa-style-master-regist-swatch-popup',
  templateUrl: './style-master-regist-swatch-popup.component.html',
  styleUrls: ['./style-master-regist-swatch-popup.component.css']
})
export class StyleMasterRegistSwatchPopupComponent extends BasePage implements OnInit {
  uploadFile: any = {};
  attachFiles: any;
  imageSelected: boolean = false;
  modalRef: BsModalRef;
  cate_cd: number;
  customerId: string = '';
  customerInfo: CustomerMaterialModel;
  isDisable: boolean = false;
  options_popup: any;
  cateId: any;
  isFilterGrid: boolean = true;
  userLogin: any;
  mStyle: any = null;
  //-----------------------------------------
  detailInfo: StyleMasterSwatchModel;
  file: any;


  //-----------------------------------------
  @Input() ParentInfo: string;
  listenFunc: Function;
  
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
    private generalMasterService: GeneralMasterService,
    private downloadImageService: DownloadImageService,
    private elementRef: ElementRef,
		private renderer: Renderer,

  ) {
    super(userService);
    this.cate_cd = Category.OrgCateCode;
    this.listenFunc = renderer.listen(elementRef.nativeElement, 'click', (event) => {
			if (event.target.id == 'swatchFileDownload') {
				let fileName = event.target.attributes['alt'].value;
        let path = event.target.attributes['path'].value;
        this.downloadFile(fileName, path);
			}
		});
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {

    },
    // Messages for form validation
    messages: {
    }
  };


  ngOnInit() {
    // this.checkPermission(ProgramList.Style_Master.valueOf());
    this.mStyle = JSON.parse(this.ParentInfo);
    this.isDisable = false;
    this.detailInfo = this.styleMasterService.getStyleMasterSwatchModel();
    this.detailInfo.companyId = this.loggedUser.company_id;
    this.detailInfo.creator = this.loggedUser.user_name;
    this.initDatatable();
    setTimeout(() => {
      this.loadDataTable();
    }, 100)

    this.onReset()
    // if (!masStyle || masStyle.styleSysId == "") {
    //   this.isDisable = true;
    // }
    // else {
    //   this.isDisable = false;
    //   this.detailInfo.styleSysId = masStyle.styleSysId;
    // }
  }
  ngOnDestroy() {
		// Remove the listeners!
    this.listenFunc();
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
        { data: "swatchName", width: "30%", class: "center" },
        { data: "swatchId", width: "12%", class: "center" },
        // { data: "attachFiles", width: "20%", class: "center" },
        {
          data: (data, type, dataToSet) => {
            if (data.attachFiles === null) {
              return "";
            }
            let enCodePath = encodeURI(data.attachFiles); 
            let path = enCodePath.replace(/%5C/g,'/');
            let fileName = path.substring(path.lastIndexOf('/') + 1);
            return `<a>
            <p style="white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; " id="swatchFileDownload" alt="${fileName}" path="${path}">${fileName}</p>
            </a>`;
          },
          className: "attachFiles", width: "20%", class: "center"
        },
        { data: "swatchNo", width: "8%", class: "center" },
        {
          data: (data, type, dataToSet) => {
            return data.remark == null ? "" : data.remark;
          },
          className: "remark", width: "30%", class: "center"
        }
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
            // this.settingReset();
            this.detailInfo = new StyleMasterSwatchModel();
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
              var selectedText: string = rowSelected.swatchName;
              this.notification.confirmDialog(
                "Delete Regist Swatch!",
                `Are you sure to delete ${selectedText}?`,

                x => {
                  if (x) {

                    this.styleMasterService.deleteStyleMasterSwatch(rowSelected.swatchId).then(data => {
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
    this.detailInfo.styleSysId = this.mStyle.styleSysId;
    this.detailInfo.companyId = this.mStyle.companyId;
    if (this.uploadFile && this.imageSelected) {
      this.detailInfo.uploadFiles = this.uploadFile;
    }
    let table = $('.swatch_table').DataTable();
    if (this.detailInfo.swatchId == 0) {
      this.styleMasterService.insertStyleMasterSwatch(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          let data_temp = table.data().sort().reverse();
          data_temp.push(this.detailInfo);
          table.clear();
          table.rows.add(data_temp.sort().reverse()).draw();
          table.rows(0).select();
          this.detailInfo.swatchId = data.data.swatchId;
          this.detailInfo.createdTime = CommonFunction.formatDate(data.data.createdTime);
          this.detailInfo.changedTime = data.data.changedTime;
          this.attachFiles = "";
          this.onReset()
          window.postMessage('reload-regist-swatch', '*');
        }
      });
    } else {
      this.styleMasterService.updateStyleMasterSwatch(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
          this.onReset();
          this.attachFiles = "";
          window.postMessage('reload-regist-swatch', '*');
        }
      });
    }
  }

  downloadFile(fileName, path){
    this.downloadImageService.showImage(fileName, path);
  }

  onReset() {
    this.reloadDatatable();
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.settingReset();
    this.detailInfo = new StyleMasterSwatchModel();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }

  onClose() {
    this.modalService.hide(1);
    $("form.frm-detail")
      .validate()
      .resetForm();
  }
  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
    this.loadDataTable();
  }
  private loadDataTable() {
    if (this.mStyle.styleSysId && this.mStyle.styleSysId !== 0) {
      return this.styleMasterService.getStyleMasterSwatchByStyle(this.mStyle.styleSysId).then(rs => {
        rs.data.sort(function (a, b) {
          return b.swatchId - a.swatchId;
        });
        var table = $('.swatch_table').DataTable();
        table.clear();
        table.rows.add(rs.data).draw();
      });
    }
  }

  onChange(event) {
    var self = this;
    self.imageSelected = false;
    self.uploadFile = {};
    let file = (event.target.files && event.target.files[0]) || null;
    let fileReader = new FileReader();
    if (file) {
      self.attachFiles = file.name || '';
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        self.imageSelected = true;
        self.uploadFile = { fileName: file.name, fileType: file.type, value: fileReader.result.toString() };
      }
    }
  }

  private settingReset() {
    this.detailInfo = new StyleMasterSwatchModel();
    this.detailInfo.creator = this.loggedUser.user_name
  }
}
