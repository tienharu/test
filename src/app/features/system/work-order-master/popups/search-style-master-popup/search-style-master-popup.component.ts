import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { TraderService } from "@app/core/services/features.services/trader-master.service";
import _ from "lodash";

@Component({
  selector: 'sa-search-style-master-popup',
  templateUrl: './search-style-master-popup.component.html',
  styleUrls: ['./search-style-master-popup.component.css']
})
export class SearchStyleMasterPopupComponent extends BasePage implements OnInit {
  //-----------------------------------------
  @Output() childCall = new EventEmitter();
  @Input() buyers: any = [];
  @Input() brands: any = [];
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
    styleNo: '',
    orderType: 1,
    buyer: '',
    brand: ''
  };
  constructor(
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private traderService: TraderService,
    public styleMasterService: StyleMasterService

  ) {
    super(userService);
  }

  ngOnInit() {
    var self = this;
    self.initDatatable();
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
        { data: "styleNo", width: "20%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var brand = _.find(this.brands, function (b) {
              return b.gen_cd === data.brandGenCd;
            })
            return (brand && brand.gen_nm) || '';
          },
          className: "center", width: "20%"
        },
        {
          data: (data, type, dataToSet) => {
            var buyer = _.find(this.buyers, function (b) {
              return parseInt(b.trader_id) === parseInt(data.buyerCd);
            });
            return (buyer && buyer.trader_local_nm) || '';
          },
          className: "center", width: "20%"
        },
        {
          data: (data, type, dataToSet) => {
            return data.orderType === true ? 'Main' : 'Sample';
          },
          className: "center", width: "10%"
        },
        { data: "remark", width: "30%", className: "left" },
      ],
      pageLength: 15,
      bSort: false,
      scrollX: true,
      scrollY: true
    };
  }

  onRowClick(event) {
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  onSubmit() {
    this.search();
  }

  onClose() {
    this.modalService.hide(1);
  }
  
  private search() {
    var self = this;
    return self.styleMasterService.search(self.cri).then(function (rs) {
      if (rs.success) {
        self.data = rs.data || [];
        var table = $('.search-style-table').DataTable();
        table.clear();
        table.rows.add(self.data).draw();
      }
    })
  }
}
