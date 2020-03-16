import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'purch-order-input-disabled-editor',
  template: `
  <input type="text" 
          class="inputClass"
          id="{{idCell}}"
          [(ngModel)]="cell.newValue"
          [disabled]="!cell.getColumn().isEditable"
          [placeholder]="cell.getTitle()"
          class="form-control"/>
`,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "./../purch-order.component.css"]
})
export class CustomPurchInputDisabledEditorComponent extends DefaultEditor implements OnInit {
  currency: boolean = false;
  currencyOptions: any = {};
  idCell: string = '';
  @Output() changeAmount = new EventEmitter<any>();
  constructor() {
    super();
  }

  ngOnInit() {
    this.idCell = this.cell.getId() + this.cell.getRow().index;
  }

  onCellClick(e) {
    e.target.select();
  }

  onChange(value) {
  }

}