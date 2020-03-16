import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
@Component({
  selector: 'process-input-editor',
  template: `
  <input type="text" [ngClass]="inputClass" *ngIf="type === 1" currencyMask [options]="currencyOptions" [disabled]="disabled" class="form-control" [(ngModel)]="cell.newValue" [name]="name"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />

  <input type="text" [ngClass]="inputClass" *ngIf="type === 0" class="form-control a" [(ngModel)]="cell.newValue" [disabled]="disabled" [name]="name"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
  `,
  //   <label class="input" style="width: 100%; margin: 0px;" *ngIf="type === 2" (click)="onShowPopupInitTable()">
  //     <input type="text" [ngClass]="inputClass" id="inputItemized" [name]="name" [(ngModel)]="row && row.itemizedGenCd_text" disabled required style="width: 100%; background-color: white; padding: 0 5px;" />
  //     <i class="fa fa-search icon-2" style="position: absolute; top: 5px; right: 5px;"></i>
  // </label>

  // <ng-template #popupItemizedComponent *ngIf="type === 2">
  //   <sa-popup-modal headerTitle="Itemized Item Search" width="40%" height="400" (onClose)="closePopup()">
  //     <sa-itemized-popup (childCall)="onChange($event)" itemizedAll="{{itemizeds|json}}" itemsBind="{{items|json}}">
  //     </sa-itemized-popup>
  //   </sa-popup-modal>
  // </ng-template>
  styleUrls: ['../../../../assets/css/smart-table.scss', "./process-flow-master.component.css"]
})
export class CustomRenderSmartTableProcessInputComponent extends DefaultEditor implements OnInit {
  @ViewChild("popupItemizedComponent") popupItemizedComponent;

  disabled: boolean = false;
  patternRegx = /^\d+$/;
  //
  type: number = 0;
  currencyOptions: any = {};
  modalRef: BsModalRef;
  itemizeds: GeneralMasterModel[] = [];
  items: any = [];
  name: string = '';
  // row:any;
  constructor(private modalService: BsModalService, ) {
    super();
  }

  ngOnInit() {
    var id = this.cell.getId();
    var row = this.cell.getRow();
    // this.row = (row && row.getData()) || null;
    this.name = id;
    if (row && row.index === -1) {
      this.name += '_' + (row.index + 1);
    }

    if (id === 'processStepNo') {
      var dataRow = row.getData();
      if (dataRow && dataRow.processPathId) {
        this.disabled = true;
      }
    }
    // this.disabled = row.data && row.data.processPathId && 
    var editor = this.cell.getColumn().editor;
    if (editor.config && editor.config.type) {
      this.type = editor.config && editor.config.type;
    }
    // this.itemizeds = (editor.config && editor.config.list) || [];
    // this.items = (editor.config && editor.config.list2) || [];
    this.currencyOptions = editor.config && editor.config.currencyOptions;
  }

  onCellClick(e) {
    e.target.select();
  }

  // onShowPopupInitTable() {
  //   let config = {
  //     keyboard: true,
  //     backdrop: true,
  //     ignoreBackdropClick: true
  //   };
  //   this.modalRef = this.modalService.show(this.popupItemizedComponent, config);
  // }

  // closePopup() {
  //   this.modalRef && this.modalRef.hide();
  // }

  // onPopupChange(item) {
  //   let rows = this.cell.getRow();
  //   rows.setData({
  //     assyItemId: item.itemCd,
  //     bomComponentItemNm: item.itemNm,
  //     itemized: item.itemizedNm,
  //     unit: item.stockUnitNm,
  //     act: item.useYn ? 'Yes' : 'No',
  //     bomQty: rows.cells[4].newValue,
  //     remark: rows.cells[7].newValue
  //   });
  // }
}