import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'due-out-material-input-editor',
  template: `
    <input type="text" [ngClass]="inputClass" [disabled]="!cell.getColumn().isEditable"  class="form-control required" [(ngModel)]="cell.newValue" [name]="name" (keyup)="onEditedUp()" required/>
`,
  styleUrls: ['../../../../assets/css/smart-table.scss', "../../order/sales-order-create/sales-order-create.component.css"]
})
export class CustomRenderSmartTableDueOutMaterialInputComponent extends DefaultEditor implements OnInit {
  name: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    var editor = this.cell.getColumn().editor;
  }

  onCellClick(e) {
    e.target.select();
  }
  
  onEditedUp() {
    let rows = this.cell.getRow();
    let current = rows.cells[9].getValue();
    let dueOut = rows.cells[11].newValue;
    rows.cells[12].newValue = Number(current) - Number(dueOut);
  }
}