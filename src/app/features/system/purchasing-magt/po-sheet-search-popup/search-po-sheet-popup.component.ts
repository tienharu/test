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
import { PoSheetPopupModel, SearchPOSheetModel } from '@app/core/models/purch-order-header.model';
import { PoSheetService } from '@app/core/services/features.services/po-sheet.service';
@Component({
  selector: 'sa-search-po-sheet-popup',
  templateUrl: './search-po-sheet-popup.component.html',
  styleUrls: ['./search-po-sheet-popup.component.css']
})
export class SearchPoSheetPopupComponent extends BasePage implements OnInit {
  @ViewChild("popupSupplierInformation") popupSupplierInformation;
  @Output() childCall = new EventEmitter();
  modalRef: BsModalRef;
  options_popup: any;
  searchInfo: SearchPOSheetModel;
  data = [];
  validationOptions: any
  optionsDatePicker: any = {}
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

  initValidation() {
    this.optionsDatePicker = {
      onClose: function () {
        $('.datePicker').valid();
      }
    }
    this.validationOptions = {
      ignore: [],
      rules: {
        to_date: {
          greaterThanOrEqual: "from_date"
        },
      },
      // Messages for form validation
      messages: {
      }
    };
  }

  ngOnInit() {
    this.initDatatable();
    this.searchInfo = new SearchPOSheetModel();
    this.search();
  }

  private search() {
    var self = this;
    self.searchInfo.poSheetNo = this.cri.poSheetNo;
    self.searchInfo.statusCd = this.cri.statusCd === '-1' ? null : this.cri.statusCd;
    self.searchInfo.fromPoDate = this.cri.fromPoDate;
    self.searchInfo.toPoDate = this.cri.toPoDate;
    return this.poSheetPopupService.getPOSheetSearch(this.searchInfo).then(rs => {
      self.data = (rs && rs.result) || [];
      var reqs = _.map(self.data, function(item){
        return self.poSheetPopupService.getPurchOrderHeaderById(item.poSheetNo).then(function(res){
          if(res.success){
            return res.data
          }
          return null;
        });
      });
      return Promise.all(reqs);
    }).then(function(rs){
      self.data = _.filter(rs, function(rs){
        return rs !== null;
      });
      let table = $('.tablePoSheet').DataTable();
      table.clear();
      table.rows.add(rs).draw();
    });
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
          }, className: "center", width: "5%"
        },
        { data: "poSheetNo", width: "15%", className: "center" },
        { 
          data: (data, type, dataToSet) => {
            return data.poSheetYmd ? "" : "";
          },  width: "10%", className: "center" 
        },
        { data: "totalSupplier", width: "10%", className: "center" },
        { data: "totalWoNo", width: "10%", className: "center" },
        { data: "totalMaterials", width: "10%", className: "center" },
        { data: "totalAmount", className: "right", render: $.fn.dataTable.render.number(','), width: "10%" },
        { data: "remark", width: "20%", className: "right" }
      ],
      pageLength: 15,
      paging: true,
      bSort: false,
      scrollX: false,
    };
  }

  onRowClick(event) {
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  onSearch() {
    this.search();
  }

  onReset() {
    $("form.frm-detail_popup")
    .validate().resetForm();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }

  }