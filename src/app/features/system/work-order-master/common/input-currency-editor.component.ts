import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import _ from 'lodash';

@Component({
  selector: 'work-order-input-currency-editor',
  template: `
  <label class="input">
  <input type="text" currencyMask [options]="{prefix:'', suffix:'', precision : 0, allowNegative : false }" (blur)="calculateAmount($event)" class="form-control" [(ngModel)]="cell.newValue" [name]="name"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
  </label>
  `,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "../work-order-master.component.css"]
})
export class CustomRenderSmartTableWorkOrderInputCurrencyComponent extends DefaultEditor implements OnInit {
  name: string = '';
  id: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    var id = this.cell.getId();
    var row = this.cell.getRow();
    this.name = id;
    this.id = id;
    if (row && row.index === -1) {
      this.name += '_' + (row.index + 1);
    }
  }

  onCellClick(e) {
    e.target.select();
  }

  calculateAmount(e){
    
  }
}