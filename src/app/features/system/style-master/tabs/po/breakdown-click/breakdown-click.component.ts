import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { StyleMasterService } from '@app/core/services/features.services/style-master.service';
import { CommonFunction } from '@app/core/common/common-function';
import * as _ from 'lodash'

@Component({
  selector: 'sa-breakdown-click',
  templateUrl: './breakdown-click.component.html',
  styleUrls: ['./breakdown-click.component.css', '../../../../../../../assets/css/smart-table.scss']
})
export class BreakdownClickComponent extends DefaultEditor implements OnInit, AfterViewInit {
  @ViewChild('popupBreakdownClick') popupBreakdownClick: ElementRef;
  modalRef: BsModalRef;
  name: string = '';
  poId: number = null;
  styleSysId: number = null;
  sizeGroupGenCd: string = null;
  styleColors: any = [];
  isAdded: boolean = false;
  constructor(
    private modalService: BsModalService,
    public styleMasterService: StyleMasterService,
  ) {
    super();
  }

  ngOnInit() {
    var id = this.cell.getId();
    var row = this.cell.getRow();
    this.name = id;
    if (row && row.index === -1) {
      this.isAdded = true;
      this.name += '_' + (row.index + 1);
    }

    if (id === 'poQty') {
      let rows = this.cell.getRow();
      var data = rows.getData();
      this.poId = data.poId || null;
      this.sizeGroupGenCd = data.sizeGroupGenCd || null;
      var editor = this.cell.getColumn().editor;
      this.styleSysId = (editor.config && editor.config.styleSysId) || null;
      this.styleColors = data.styleColors || [];
    }
  }

  ngAfterViewInit(): void {
  }

  onShowPopupInitTable() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupBreakdownClick, config);
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  onChange(item) {
    let rows = this.cell.getRow();
    var data = rows.getData();
    data.poQty = item.total || 0;
    var planQty = CommonFunction.FormatCurrency(data.poQty) + ((CommonFunction.FormatCurrency(data.poQty) * CommonFunction.FormatCurrency(data.lossRate) / 100));
    data.planQty = Math.round(planQty || 0);
    var amount = CommonFunction.FormatCurrency(data.poQty) * CommonFunction.FormatCurrency(data.price);
    data.amount = amount || 0;
    data.pocsList = item.pocsList || [];
    data.styleColors = item.styleColors || [];
    data.sizeGroupGenCd = item.sizeGroupCd || null;
    rows.setData(data);
  }
}
