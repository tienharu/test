import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'purch-order-textarea-editor',
  template: `
  <textarea autocomplete="off"
            rows="2"
            class="form-control"
            id="{{idCell}}"
            [(ngModel)]="cell.newValue"
            [name]="cell.getId()"
            [disabled]="!cell.getColumn().isEditable"
            [placeholder]="cell.getTitle()">
  </textarea>`,
  styleUrls: ['../../../../../assets/css/smart-table.scss',"./../inbount-style.component.css"]
})
export class CustomInboundStyleTextareaEditorComponent extends DefaultEditor implements OnInit {
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