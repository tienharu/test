import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'purch-order-input-disabled-editor',
  template: `
  <input type="text" style="text-align: right"
          class="inputClass"
          id="{{idCell}}"
          [(ngModel)]="cell.newValue"
          [disabled]="!cell.getColumn().isEditable"
          [placeholder]="cell.getTitle()"
          class="form-control"/>
`,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "./../inbount-style.component.css"]
})
export class CustomInboundStyleDisabledEditorComponent extends DefaultEditor implements OnInit {
  idCell: string = '';
  @Output() changeAmount = new EventEmitter<any>();
  constructor() {
    super();
  }

  ngOnInit() {
    if (Number.isInteger(this.cell.newValue)) {
      this.cell.newValue = CommonFunction.FormatMoney(this.cell.newValue);
    }
    this.idCell = this.cell.getId() + this.cell.getRow().index;
    if (this.cell.getId() === 'price') {
      this.cell.newValue = (<HTMLInputElement>document.getElementById('price')).value;
    }
  }

  onCellClick(e) {
    e.target.select();
  }
}