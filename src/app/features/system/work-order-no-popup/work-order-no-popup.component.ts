import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import _ from "lodash";
import { PurchOrderHeaderService } from '@app/core/services/features.services/purch-order-header.service';
import { CommonFunction } from '@app/core/common/common-function';
import { InboundStyleService } from '@app/core/services/inbound-style.service';

@Component({
  selector: 'sa-work-order-no-popup',
  templateUrl: './work-order-no-popup.component.html',
  styleUrls: ['./work-order-no-popup.component.css']
})
export class WorkOrderNoPopupComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;
  isDisable: boolean = false;
  supplier: number = null;
  styleNo: string = '';
  woNo: string = '';
  options: any;


  @ViewChild("popupWorkOrder") popupWorkOrder;
  @Input() checkTypePopup: any;
  @Input() traderList: any;
  @Input() sampSteps: any;
  // userLogin: any;
  @Output() childCallWo = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private purchOrderHeaderService: PurchOrderHeaderService,
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
    this.traderList = JSON.parse(this.traderList);
    if (this.checkTypePopup === "SELECT_ONE") {
      this.sampSteps = JSON.parse(this.sampSteps)
      this.initDatatableSelectOne();
    } else {
      this.initDatatableSelectMany();
    }
  }

  private initDatatableSelectMany() {
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
        { 
          render: (data, type, dataToSet) => {
            return "<label class='atman-checkbox'><input type='checkbox' class='single-checkbox' /><i></i></label>";           
          }, width: "4%" 
        },
        { data: "traderLocalNm", width: "14%" },
        { data: "styleNo", width: "10%", className: "center" },
        { data: "woNo", width: "13%",className: "center" },
        { data: (data, type, dataToSet) => {
            return CommonFunction.formatDate(data.woYmd);
          },
          width: "12%", className: "center" },
        { data: "orderType", width: "9%", className: "center" },
        { data: "inning", width: "6%", className: "center" },
        { data: "sampleStepGenNm", width: "10%", className: "center" },
        { data: "remark", width: "19%", className: "word-wrap"}
      ],
      pageLength: 10,
      bSort: false,
      scrollX: false,
      // scrollY: 350,
      // paging: false,
    };
  }

  private initDatatableSelectOne() {
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
        { 
          // data: "traderLocalNm", width: "14%" 
          data: (data, type, dataToSet) => {
            var buyer = _.find(this.traderList, (b) => {
              return parseInt(b.trader_id) === parseInt(data.buyer);
            });
            return (buyer && buyer.trader_local_nm) || '';
          },
          className: "center", width: "14%"
        },
        { data: "styleNo", width: "10%", className: "center" },
        { data: "woNo", width: "13%",className: "center" },
        { 
          data: (data, type, dataToSet) => {
            return CommonFunction.formatDate(data.woYmd);
          },
          width: "12%", className: "center" 
        },
        { data: "orderType", width: "9%", className: "center" },
        { data: "inning", width: "6%", className: "center" },
        { 
          // data: "sampleStepGenNm", width: "10%", className: "center" 
          data: (data, type, dataToSet) => {
            let sampleStep = _.find(this.sampSteps, (b) => {
              return parseInt(b.gen_cd) === parseInt(data.sampleStepGenCd);
            });
            return (sampleStep && sampleStep.gen_nm) || '';
          },
          className: "center", width: "14%"
        },
        { data: "remark", width: "19%", className: "word-wrap"}
      ],
      pageLength: 10,
      bSort: false,
      scrollX: false,
      // scrollY: 350,
      // paging: false,
    };
  }

  onSearch() {
    let table = $('.tableWorkOrderNo').DataTable();
    table.clear();
    if (this.checkTypePopup) {
      let objParam = {
        woNo: this.woNo ? this.woNo : 0,
        styleNo: this.styleNo ? this.styleNo : '',
        buyer: this.supplier ? this.supplier : 0
      };
      this.inboundStyleService.searchWoNo(objParam).then(data => {
        data.reverse();
        table.rows.add(data).draw();
      });
    } else {
      this.purchOrderHeaderService.searchWoNo(this.supplier, this.styleNo, this.woNo).then(data => {
        data.reverse();
        table.rows.add(data).draw();
      });
    }
    
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onSelect() {
    let table = $('.tableWorkOrderNo').DataTable();
    let rs: any[] = [];
    table.rows().every(function ( rowIx, tableLoop, rowLoop) {
      let data = this.node();  
      if ($(data).find('input.single-checkbox').prop('checked')) {
        rs.push(this.data());
      }
    });
    if(rs.length < 1) {
      this.notification.showError("You must check before select!");
    } else {
      this.childCallWo.emit(rs.map(item => item.woNo));
      this.modalService.hide(1);
    }
  }

  onRowClick(event) {
    this.childCallWo.emit(event);
    this.modalService.hide(1);
  }

  onClose() {
    this.modalService.hide(1);
  }
}
