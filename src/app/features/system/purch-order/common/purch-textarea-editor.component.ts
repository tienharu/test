import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'purch-order-textarea-editor',
  template: `
  <textarea autocomplete="off"
            rows="1"
            class="form-control"
            id="{{idCell}}"
            [(ngModel)]="cell.newValue"
            [name]="cell.getId()"
            [disabled]="!cell.getColumn().isEditable"
            [placeholder]="cell.getTitle()">
  </textarea>`,
  styleUrls: ['../../../../../assets/css/smart-table.scss',"./../purch-order.component.css"]
})
export class CustomPurchTextareaEditorComponent extends DefaultEditor implements OnInit {
  currency: boolean =false;
  currencyOptions: any = {};
  idCell: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    this.idCell = this.cell.getId() + this.cell.getRow().index;
  }

  onCellClick(e){
    e.target.select();
  }
}