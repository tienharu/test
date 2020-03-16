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

@Component({
  selector: 'sa-bom-master-popup',
  templateUrl: './bom-master-popup.component.html',
  styleUrls: ['./bom-master-popup.component.css']
})
export class BomMasterPopupComponent extends BasePage implements OnInit, AfterViewInit {
  opportunityInfo: CrmSalesOpportunityModel;
  adminInChage: any[] = [];

  modalRef: BsModalRef;
  isDisable: boolean = false;
  bomItems: BomItem[] = [];
  bomItemsSeachResult: BomItem[] = [];
  searhInfo: BomItem;

  itemizeds: GeneralMasterModel[] = [];

  @Input() itemCheck: any;
  @Input() itemizedAll: any;
  @Input() bomItemsBind: any;

  options: any;
  @ViewChild("popupBomItem") popupBomItem;
  userLogin: any;
  @Output() childCall = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private bomMasterPopupService: BomMasterPopupService,
    private modalService: BsModalService
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
    this.searhInfo = this.bomMasterPopupService.getModel();
    if(this.itemCheck == 1) {
      this.initBomItem1(JSON.parse(this.itemizedAll));
    } else {
      this.initBomItem2(JSON.parse(this.itemizedAll));
    }
    this.bomItems = JSON.parse(this.bomItemsBind);
    console.log('-------------------',this.bomItems)
  }

  ngAfterViewInit(): void {
    let table = $('.tableItem').DataTable();
    table.clear();
    table.rows.add(this.bomItems).draw();
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
      scrollX: true,
      // scrollY: 350,
      // paging: false,
    };
  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  onSearch() {
    let table = $('.tableItem').DataTable();
    table.clear();
    if(this.searhInfo.itemizedCd && this.searhInfo.itemNm) {
      return Promise.all(this.bomItems.filter(x => (x.itemizedCd == this.searhInfo.itemizedCd && x.itemNm.toLowerCase().includes(this.searhInfo.itemNm.toLowerCase())))).then(res => {
        this.bomItemsSeachResult = res;
        table.rows.add(this.bomItemsSeachResult).draw();
      });
    } else if (!this.searhInfo.itemizedCd && this.searhInfo.itemNm) {
      return Promise.all(this.bomItems.filter(x => x.itemNm.toLowerCase().includes(this.searhInfo.itemNm.toLowerCase()))).then(res => {
        this.bomItemsSeachResult = res;
        table.rows.add(this.bomItemsSeachResult).draw();
      });
    } else if (this.searhInfo.itemizedCd && !this.searhInfo.itemNm){
      return Promise.all(this.bomItems.filter(x => x.itemizedCd == this.searhInfo.itemizedCd)).then(res => {
        this.bomItemsSeachResult = res;
        table.rows.add(this.bomItemsSeachResult).draw();
      });
    } else if (this.searhInfo.itemizedCd == null && !this.searhInfo.itemNm){
      table.rows.add(this.bomItems).draw();
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }

  private initBomItem1(listItemizedAll: GeneralMasterModel[]) {
    listItemizedAll.forEach(element => {
      if(element.ck_value_1 != "1" && element.ck_value_1 != "2" && element.ck_value_1 != "4" && element.ck_value_1 != "5") {
        this.itemizeds.push(element);
      }
    });
  }

  private initBomItem2(listItemizedAll: GeneralMasterModel[]) {
    listItemizedAll.forEach(element => {
      if(element.ck_value_1 != "3" && element.ck_value_1 != "4" && element.ck_value_1 != "5") {
        this.itemizeds.push(element);
      }
    });
  }
}
