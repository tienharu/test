import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { WorkOrderMasterModel, SearchWorkOrderModel } from '@app/core/models/work-order-master-model';

import _ from "lodash";

@Component({
  selector: 'sa-search-work-order-master-popup',
  templateUrl: './search-work-order-master-popup.component.html',
  styleUrls: ['./search-work-order-master-popup.component.css']
})
export class SearchWorkOrderMasterPopupComponent extends BasePage implements OnInit {
  //-----------------------------------------
  @Output() childCall = new EventEmitter();
  @Input() buyers: any = [];
  @Input() brands: any = [];
  @Input() sampSteps: any = [];
  modalRef: BsModalRef;
  options: any;
  selectedStyle: any = null;
  data: any = [];
  orderTypes: any = [
    {
      value: 1,
      text: 'Main'
    },
    {
      value: 0,
      text: 'Sample'
    }
  ];
  cri: any = {
    woNo: '',
    styleNo: '',
    orderType: 1,
    inning: '',
    sampleStepGenCd: '',
    buyer: '',
    brand: '',
  };

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      woNo: {
        digits: true
      },
      styleNo: {
        digits: true
      }
    },
    // Messages for form validation
    messages: {
      woNo: {
        digits: ''
      },
      styleNo: {
        digits: ''
      },
    }
  }
  constructor(
    public programService: ProgramService,
    public userService: AuthService,
    public workOrderMasterService: WorkOrderMasterService,
    private modalService: BsModalService,
    private styleMasterService: StyleMasterService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.initDatatable();
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
        { data: "woNo", width: "20%", className: "center" },
        { data: "styleNo", width: "20%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var buyer = _.find(this.buyers, function (b) {
              return parseInt(b.trader_id) === parseInt(data.buyer);
            });
            return (buyer && buyer.trader_local_nm) || '';
          },
          className: "center", width: "20%"
        },
        { data: "inning", width: "20%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var brand = _.find(this.brands, function (b) {
              return b.gen_cd === data.brand;
            })
            return (brand && brand.gen_nm) || '';
          },
          className: "center", width: "20%"
        },
        {
          data: (data, type, dataToSet) => {
            var sample = _.find(this.sampSteps, function (b) {
              return b.gen_cd === data.sampleStepGenCd;
            })
            return (sample && sample.gen_nm) || '';
          },
          className: "center", width: "20%"
        }
      ],
      scrollY: 210,
      scrollX: true,
      paging: true,
      pageLength: 15,
    };
  }

  onRowClick(event) {
    var self = this;
    var cri = new SearchWorkOrderModel();
    cri.woNo = event.woNo;
    cri.orderType = self.cri.orderType === 1 ? true : false;
    cri.styleNo = '';
    cri.inning = 0;
    cri.buyer = 0;
    cri.sampleStepGenCd = '';
    cri.brand = '';
    return self.workOrderMasterService.search(cri).then(function (rs) {
      self.childCall.emit({
        selected: event,
        workOrderList: rs
      });
      self.modalService.hide(1);
    });
  }

  onSubmit() {
    const _invalid = $("form.frm-search-work-order").valid();
    if (!_invalid) {
      return;
    }
    this.search();
  }

  onClose() {
    this.modalService.hide(1);
  }

  private search() {
    var self = this;
    var cri = new SearchWorkOrderModel();
    cri.woNo = Number(self.cri.woNo);
    cri.orderType = self.cri.orderType === 1 ? true : false;
    cri.styleNo = self.cri.styleNo;
    cri.inning = Number(self.cri.inning);
    cri.buyer = Number(self.cri.buyer);
    cri.sampleStepGenCd = self.cri.sampleStepGenCd;
    cri.brand = self.cri.brand;
    return self.workOrderMasterService.search(cri).then(function (rs) {
    // return self.workOrderMasterService.getAllWorkOrderMaster().then(function (rs) {
      console.log(rs);
      self.data = rs;
      var table = $('.search-work-order-table').DataTable();
      table.clear();
      table.rows.add(self.data).draw();
      // return self.getMoreInfo(rs);
    })
    // .then(function (rs) {
    //   console.log(rs);
    //   self.data = rs;
    //   var table = $('.search-work-order-table').DataTable();
    //   table.clear();
    //   table.rows.add(self.data).draw();
    // });
  }

  private getMoreInfo(data) {
    var self = this;
    var reqs = _.map(data, function (item) {
      return self.styleMasterService.getStyleById(item.styleSysId).then(function (style) {
        if (style) {
          item.styleData = style.success ? style.data : null;
          item.buyerCd = (item.styleData && item.styleData.buyerCd) || "";
          item.brandGenCd = (item.styleData && item.styleData.brandGenCd) || "";
        }
        return item;
      });
    });
    return Promise.all(reqs);
  }

}
