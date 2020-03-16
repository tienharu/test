import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { MaterialMasterPopupService } from '@app/core/services/features.services/material-master-popup.service';
import _ from "lodash";

@Component({
  selector: 'sa-itemized-popup',
  templateUrl: './itemized-popup.component.html',
  styleUrls: ['./itemized-popup.component.css']
})
export class ItemizedPopupComponent extends BasePage implements OnInit, AfterViewInit {
  modalRef: BsModalRef;
  items: any[] = [];
  itemsSeachResult: any[] = [];
  cri: any = {
    itemized_cd: '',
    itemized_nm: ''
  };
  itemizeds: GeneralMasterModel[] = [];
  allItemized: any = [];
  @ViewChild("popupItemized") popupItemized;
  @Output() childCall = new EventEmitter();
  @Input() itemCheck: any;
  @Input() itemizedAll: any;
  @Input() itemsBind: any;
  options: any;
  isFilterGrid: boolean = true;
  constructor(
    public programService: ProgramService,
    public userService: AuthService,
    public materialMasterPopupService: MaterialMasterPopupService,
    private modalService: BsModalService,
  ) {
    super(userService);
  }

  ngOnInit() {
    var self = this;
    self.allItemized = JSON.parse(self.itemizedAll);
    self.initDatatable();
    self.itemizeds = _.filter(self.allItemized, function (element) {
      if (self.itemCheck == 1) {
        return element.ck_value_1 != "1" && element.ck_value_1 != "2" && element.ck_value_1 != "4" && element.ck_value_1 != "5";
      } else if (self.itemCheck == 2) {
        return element.ck_value_1 != "3" && element.ck_value_1 != "4" && element.ck_value_1 != "5";
      }
      return element.ck_value_1 !== "1" && element.ck_value_1 !== "2" && element.ck_value_1 !== "3" && element.ck_value_1 !== "4" && element.ck_value_1 !== "5";
    });
    console.log('==============self.itemizeds');
    console.log(self.itemizeds);

    self.items = JSON.parse(this.itemsBind);
  }

  ngAfterViewInit(): void {
    let table = $('.tableItem').DataTable();
    table.clear();
    table.rows.add(this.items).draw();
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
          }, className: "center", width: "5%"
        },
        { data: "itemizedNm", width: "20%", className: "center" },
        { data: "itemNm", width: "30%", className: "center" },
        { data: "itemSeq", width: "20%", className: "center" },
        { data: "stockUnitNm", width: "15%", className: "center" }
      ],
      pageLength: 15,
      bSort: false,
      scrollX: true
    };
  }

  onRowClick(event) {
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  onSearch() {
    let table = $('.tableItem').DataTable();
    table.clear();
    var result = this.items.filter(x => {
      if (this.cri.itemized_cd && this.cri.itemized_nm) {
        return x.itemizedCd === this.cri.itemized_cd && x.itemNm.toLowerCase().includes(this.cri.itemized_nm.toLowerCase());
      } else if (this.cri.itemized_cd) {
        return x.itemizedCd === this.cri.itemized_cd;
      } else if (this.cri.itemized_nm) {
        return x.itemNm.toLowerCase().includes(this.cri.itemized_nm.toLowerCase());
      }
      return x;
    });
    table.rows.add(result).draw();
  }

  onClose() {
    this.modalService.hide(1);
  }
}
