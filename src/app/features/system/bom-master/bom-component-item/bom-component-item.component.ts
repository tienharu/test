import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { DefaultEditor } from 'ng2-smart-table';
import { BomItem } from '@app/core/models/bom-assy-master.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralMasterModel } from '@app/core/models/general_master.model';

@Component({
  selector: 'app-bom-component-item',
  templateUrl: './bom-component-item.component.html',
  styleUrls: ['./bom-component-item.component.css', '../../../../../assets/css/smart-table.scss', "../bom-master.component.css"]
})
export class BomCompItemComponent extends DefaultEditor implements OnInit, AfterViewInit {

  @ViewChild('bomComponentItemSelect') bomComponentItemSelect: ElementRef;
  modalRef: BsModalRef;
  itemizeds: GeneralMasterModel[] = [];
  bomItemComponent: BomItem;
  bomItems2: BomItem[] = [];
  name: string = '';
  @ViewChild("popupBomItemComponent") popupBomItemComponent;
  constructor(
    private modalService: BsModalService,
  ) {
    super();
  }

  ngOnInit() { 
    let editor = this.cell.getColumn().editor;
    this.itemizeds = (editor.config && editor.config.list) || [];
    this.bomItems2 = (editor.config && editor.config.list2) || [];
    this.bomItemComponent = new BomItem();
    var id = this.cell.getId();
    var row = this.cell.getRow();
    this.name = id;
    if (row && row.index === -1) {
        this.name += '_' + (row.index + 1);
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
    this.modalRef = this.modalService.show(this.popupBomItemComponent, config);
  }

  closePopup() {
    this.modalRef && this.modalRef.hide();
  }

  getBomItem(bomItem) {
    this.onChange(bomItem);
  }

  onChange(item) {
    //moi khi change select gan lai du lieu vào cell tren ng2-smart-table
    let rows = this.cell.getRow();
    rows.setData({
      assyItemId: item.itemCd,
      bomComponentItemNm: item.itemNm,
      itemized: item.itemizedNm,
      unit: item.stockUnitNm,
      act: item.useYn ? 'Yes' : 'No',
      bomQty: rows.cells[4].newValue,
      remark: rows.cells[7].newValue
    });
  }
}
