import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DefaultEditor, Cell } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';

@Component({
  selector: 'purch-order-input-editor',
  template: `
  <input type="text"
          class="inputClass" 
          currencyMask [options]="{prefix:'', suffix:'', precision: 0, allowNegative: false}"
          id="{{idCell}}"
          [(ngModel)]="cell.newValue"
          [placeholder]="cell.getTitle()"
          (ngModelChange)="onChange($event)"
          class="form-control"/>
`,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "./../inbount-style.component.css"]
})
export class CustomInboundStyleEditorComponent extends DefaultEditor implements OnInit {
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
    let priceValueOnCreate = (<HTMLInputElement>document.getElementById('price-' + this.idCell.split('-')[1]));
    let priceValueOnUpdate = (<HTMLInputElement>document.getElementById('price' + this.idCell.match(/\d+/g)[0]));
    let priceValue = priceValueOnCreate || priceValueOnUpdate;
    this.calcRemainAndAmount(this.cell.getRow().getCells(), value, priceValue.value);
  }

  private calcRemainAndAmount(cells: Cell[], valueChange: any, priceValue: any) {
    cells[6].newValue =  CommonFunction.FormatMoney(parseInt(CommonFunction.removeComma(cells[3].newValue)) - parseInt(CommonFunction.removeComma(cells[4].newValue)) - valueChange);
    cells[8].newValue = priceValue && priceValue !== '0' ? CommonFunction.FormatMoney(parseInt(CommonFunction.removeComma(priceValue)) * valueChange) : priceValue;
  }

}