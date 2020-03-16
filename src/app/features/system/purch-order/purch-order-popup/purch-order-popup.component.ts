import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import _ from "lodash";
import { BomMasterPopupService } from '@app/core/services/features.services/bom-master-popup-service';
import { BomItem } from '@app/core/models/bom-assy-master.model';
import { PurchOrderHeaderModel } from '@app/core/models/purch-order-header.model';
import { PurchOrderHeaderService } from '@app/core/services/features.services/purch-order-header.service';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'sa-purch-order-popup',
  templateUrl: './purch-order-popup.component.html',
  styleUrls: ['./purch-order-popup.component.css']
})
export class PurchOrderPopupComponent extends BasePage implements OnInit, AfterViewInit {
  modalRef: BsModalRef;
  purchOrderHeaders: PurchOrderHeaderModel[] = [];
  fromDate: string = null;
  toDate: string = null;
  poSheetNo: number = null;
  options: any;
  // userLogin: any;
  @Output() childCallPo = new EventEmitter();
  constructor(
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private purchOrderHeaderService: PurchOrderHeaderService
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
    this.initDatatable();
  }

  ngAfterViewInit(): void {
    // let table = $('.tableItem').DataTable();
    // table.clear();
    // table.rows.add(this.bomItems).draw();
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.purchOrderHeaderService.listPurchOrderHeaderAll().then(data => {
          data.reverse();
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
          }, className: "center", width: "3%"
        },
        { data: "poSheetNo", width: "20%", className: "center" },
        { 
          data: data => CommonFunction.formatDate(data.poSheetYmd), 
          width: "10%", className: "center" 
        },
        { data: "totalWoNo", width: "8%", className: "center" },
        { data: "totalSupplier", width: "8%", className: "center" },
        { data: "totalMaterials", width: "8%", className: "center" },
        { data: "totalAmount", width: "16%", className: "center" },
        { data: "remark", width: "27%", className: "word-wrap" },
      ],
      pageLength: 15,
      bSort: true,
      scrollX: false,
      // scrollY: 350,
      // paging: false,
    };
  }

  onSearch() {
    let searchInfo = {
      fromPoDate: this.fromDate != '' ? this.fromDate : null,
      toPoDate: this.toDate != '' ? this.toDate : null,
      poSheetNo: this.poSheetNo
    }
    let table = $('.tableSearchPurchOrderHeader').DataTable();
    table.clear();
    this.purchOrderHeaderService.searchPurchOrderHeader(searchInfo).then(rs => {
      rs.reverse();
      table.rows.add(rs).draw();
    });
  }

  onRowClick(event: any) {
    this.childCallPo.emit(event);
    this.modalService.hide(1);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }
}
