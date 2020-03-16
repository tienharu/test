import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from '@app/shared/i18n/i18n.service';
import _ from "lodash";
import { PoSheetPopupModel, PurchOrderHeaderModel, SearchPOSheetModel } from '@app/core/models/purch-order-header.model';
import { PoSheetService } from '@app/core/services/features.services/po-sheet.service';

@Component({
  selector: 'sa-po-sheet-popup',
  templateUrl: './po-sheet-popup.component.html',
  styleUrls: ['./po-sheet-popup.component.css']
})
export class PoSheetPopupComponent extends BasePage implements OnInit {
  //-----------------------------------------
  @ViewChild("popupSupplierInformation") popupSupplierInformation;
  @Output() childCall = new EventEmitter();
  modalRef: BsModalRef;
  options_popup: any;
  searchInfo: SearchPOSheetModel;
  purchOrderHeaders: PurchOrderHeaderModel[] = [];
  searchResult: PurchOrderHeaderModel[] = [];
  statuses: any = [
    {
      value: '-1',
      text: 'ALL'
    },
    {
      value: "N",
      text: 'N'
    },
    {
      value: 'Y',
      text: 'Y'
    },
    {
      value: 'Ing',
      text: 'Ing'
    }
  ];
  cri: any = {
    poSheetNo: null,
    fromPoDate: null,
    toPoDate: null,
    statusCd: '-1',
  };
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    private modalService: BsModalService,
    private router: Router,
    public poSheetPopupService: PoSheetService
  ) {
    super(userService);
    this.loggedUser = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.initDatatable();
    this.checkPermission(ProgramList.PO_Sheet.valueOf());
    this.searchInfo = new SearchPOSheetModel();
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
        { data: "poSheetNo", width: "25%", className: "center" },
        { data: "supplier", width: "25%", className: "center" },
        { data: "issued", width: "25%", className: "center" },
        { data: "bal", width: "15%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            if(!data.poSheetNoStatus){
              return 'N';
            }
            return data.poSheetNoStatus;
          },
          className: "center", width: "25%"
        }
        // { data: "poSheetNoStatus", width: "25%", className: "center" },
      ],
      scrollY: 210,
      scrollX: true,
      paging: true,
      pageLength: 10
    };
  }

  onRowClick(event) {
    // var f = $("form.frm-detail_popup").validate();
    // if (!f.valid()) {
    //   f.resetForm();
    // }
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  onSearch() {
    this.searchInfo.poSheetNo = this.cri.poSheetNo;
    this.searchInfo.statusCd = this.cri.statusCd === '-1' ? null : this.cri.statusCd;
    this.searchInfo.fromPoDate = this.cri.fromPoDate;
    this.searchInfo.toPoDate = this.cri.toPoDate;
    this.poSheetPopupService.getPOSheetSearch(this.searchInfo).then(rs => {
      var data = (rs && rs.result) || [];
      let table = $('.tablePoSheet').DataTable();
      table.clear();
      table.rows.add(data).draw();
      // if (rs.result != null) {
      //   table.rows.add(rs.result).draw();
      //   // this.notification.showMessage("success", "Found " + rs.length + " BOM!");
      // } else {
      //   table.rows.add(rs.result).draw();
      //   // this.notification.showMessage("error", "BOM not found!");
      // }
    });
  }

  onClose() {
    this.modalService.hide(1);
  }
}