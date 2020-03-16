import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NotificationService, ProgramService, AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { SearchPoModel, ResultPOModel } from '@app/core/models/purchasing-header.model';
import { PurchasingMagtService } from '@app/core/services/purchasing-magt.service';

@Component({
  selector: 'sa-purchasing-search-popup',
  templateUrl: './purchasing-search-popup.component.html',
  styleUrls: ['./purchasing-search-popup.component.css']
})
export class PurchasingSearchPopupComponent implements OnInit {
  options_popup: any;
  @Output() childCallPo = new EventEmitter();
  modalRef: BsModalRef;
  searchPoInfo: SearchPoModel =  new SearchPoModel();
  resultPOModel:ResultPOModel
  orderTypes: any = [{
    value: '0',
    text: 'Y'
  },
  {
    value: '1',
    text: 'Ing'
  },
  {
    value: '2',
    text: 'N'
  },
  {
    value: '-1',
    text: 'ALL'
  }];
 
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService,
    private purchasingHearderService : PurchasingMagtService,
    private modalService: BsModalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.searchPoInfo.companyId = 1000;
    this.resultPOModel = new ResultPOModel();
    this.initDatatable();
  }
  
  private initDatatable() {
    this.options_popup = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.purchasingHearderService.listSearchPurchNo(this.searchPoInfo).then(data => {
          console.log("listSearchPurchNo",data)
          callback({
            aaData: data.result
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
          render: (data, type, dataToSet) => {
            return "<label class='atman-checkbox'><input type='checkbox' class='single-checkbox' /><i></i></label>";           
          }, width: "5%" 
        },
        { data: "itemizedGenCd", width: "10%", className: "center" },
        { data: "itemizedGenNm", width: "10%", className: "center" },
        { data: "materialDsplNm", width: "15%", className: "center" },
        { data: "materialCd", width: "10%", className: "center" },
        { data: "unit", width: "5%", className: "center" },
        { data: "colorName", width: "5%", className: "center" },
        { data: "poQty", width: "5%", className: "center" },
        { data: "price", width: "5%", className: "center" },
        { data: "amount", width: "5%", className: "center" },
        { data: "poUniqueNo", width: "10%", className: "center" },
        { data: "inedQty", width: "5%", className: "center" },
        { data: "pricePurch", width: "15%", className: "center" },
        { data: "poNoStatus", width: "5%", className: "center" },
      ],
      pageLength: 10,
      bSort: false,
      scrollX: true,
    };
  }

  searchData() {
    if (this.searchPoInfo.poSheetNo == null) {
      return this.notification.showMessage("error","Please select PO Sheet No");
    }
    this.reloadDatatable();
  }

  onSelect() {
    let table = $('.tablePoSheet').DataTable();
    let rs: any[] = [];
    table.rows().every(function ( rowIx, tableLoop, rowLoop) {
      let data = this.node();  
      if ($(data).find('input.single-checkbox').prop('checked')) {
        rs.push(this.data());
      }
    });
    console.log("rs", rs);
    if(rs.length < 1) {
      this.notification.showError("You must check before select!");
    } else {
      this.childCallPo.emit(rs.map(item => item));
      this.modalService.hide(1);
    }
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
  }
}
