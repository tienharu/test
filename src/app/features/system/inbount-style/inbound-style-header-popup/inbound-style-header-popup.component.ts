import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import _ from "lodash";
import { PurchOrderHeaderModel } from '@app/core/models/purch-order-header.model';
import { CommonFunction } from '@app/core/common/common-function';
import { InboundStyleService } from '@app/core/services/inbound-style.service';

@Component({
  selector: 'sa-inbound-style-header-popup',
  templateUrl: './inbound-style-header-popup.component.html',
  styleUrls: ['./inbound-style-header-popup.component.css']
})
export class InboundStyleHeaderPopupComponent extends BasePage implements OnInit, AfterViewInit {
  modalRef: BsModalRef;
  purchOrderHeaders: PurchOrderHeaderModel[] = [];
  fromDate: string = null;
  toDate: string = null;
  woNo: number = null;
  styleInboundNo: number = null;
  options: any;
  @Output() childCall = new EventEmitter();
  @Input() suppliers;
  @Input() locations;
  @Input() processes;

  constructor(
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private inboundStyleService: InboundStyleService
  ) {
    super(userService);
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
    this.suppliers = JSON.parse(this.suppliers);
    this.locations = JSON.parse(this.locations);
    this.processes = JSON.parse(this.processes);
    this.fromDate = new Date().toString("yyyy-MM-dd");
    this.toDate = new Date().toString("yyyy-MM-dd");
    this.initDatatable();
  }

  ngAfterViewInit(): void {
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
          }, className: "center", width: "3%"
        },
        { data: data => CommonFunction.formatDate(data.inboundYmd) , width: "6%", className: "center word-wrap" },
        { data: "styleInboundNo", width: "10%", className: "center word-wrap" },
        { data: "woNo", width: "12%", className: "center word-wrap"},
        { data: data => {
            const supp = this.suppliers.find(x => x.traderid === data.supplierCd);
            return supp ? supp.traderlocalnm : NaN;
          }, width: "8%", className: "word-wrap"
        },
        { data: data => {
            const location = this.locations.find(x => x.gen_cd === data.locationGenCd);
            return location ? location.gen_nm : NaN;
          }, width: "8%", className: "word-wrap"
        },
        { data: data => {
            const process = this.processes.find(x => x.gen_cd === data.processGenCd);
            return process ? process.gen_nm : NaN;
          }, width: "8%", className: "word-wrap"
        },
        { data: "poNo", width: "10%", className: "word-wrap" },
        { data: "inboundQty", width: "5%", className: "right word-wrap" },
        { data: "price", width: "8%", className: "right word-wrap" },
        { data: "amount", width: "10%", className: "right word-wrap" },
        { data: "remark", width: "12%", className: "word-wrap" },
      ],
      pageLength: 10,
      bSort: true,
      scrollX: false,
      // scrollY: 350,
      // paging: false,
    };
  }

  onSearch() {
    let table = $('.tableSearchInboundStyleHeader').DataTable();
    table.clear();
    this.inboundStyleService.searchInboundStyleHeader(this.fromDate, this.toDate, this.styleInboundNo, this.woNo).then(rs => {
      table.rows.add(rs).draw();
    });
  }

  onRowClick(event: any) {
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }
}
