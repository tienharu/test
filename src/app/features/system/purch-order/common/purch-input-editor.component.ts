import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'purch-order-input-editor',
  template: `
  <input type="text"
          class="inputClass" 
          currencyMask [options]="{prefix:'', suffix:'', precision: 0, allowNegative: false}"
          id="{{idCell}}"
          [(ngModel)]="cell.newValue"
          [disabled]="!cell.getColumn().isEditable"
          [placeholder]="cell.getTitle()"
          (ngModelChange)="onChange($event)"
          class="form-control"/>
`,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "./../purch-order.component.css"]
})
export class CustomPurchInputEditorComponent extends DefaultEditor implements OnInit {
  name: string = '';
  patternRegx = /^\d+$/;
  idCell: string = '';
  //
  currency: boolean = false;
  currencyOptions: any = {};
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
    let id = this.cell.getId();
    if (id === "poQty") {
      let price = this.cell.getRow().cells[11].newValue;
      if (price !== undefined && price != 0 && price !== null) {
        this.cell.getRow().cells[12].newValue = CommonFunction.FormatMoney(value * price, 0);
      }
      this.cell.getRow().cells[13].newValue = this.cell.getRow().getData().poPlanQty - value;
    } else if (id === "price") {
      let poQty = this.cell.getRow().cells[10].newValue;
      if (poQty !== undefined && poQty != 0 && poQty !== null) {
        this.cell.getRow().cells[12].newValue = CommonFunction.FormatMoney(value * poQty, 0);
      }
    }
  }

}