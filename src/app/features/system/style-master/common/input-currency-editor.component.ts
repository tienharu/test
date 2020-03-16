import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';
import _ from 'lodash';

@Component({
  selector: 'style-input-currency-editor',
  template: `
  <label class="input">
  <input type="text" currencyMask [options]="{prefix:'', suffix:'', precision : 0, allowNegative : false }" (blur)="calculateAmount($event)" class="form-control" [(ngModel)]="cell.newValue" [name]="name"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
  </label>
  `,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "../style-master.component.css"]
})
export class CustomRenderSmartTableStyleInputCurrencyComponent extends DefaultEditor implements OnInit {
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
    //custom for material tab
    if(this.id === "netYield" || this.id === "lossYield"){
      let rows = this.cell.getRow(); 
      var data = rows.getNewData();
      let totalYield = CommonFunction.FormatCurrency(data.netYield) + CommonFunction.FormatCurrency(data.lossYield);
      let needQty = CommonFunction.FormatCurrency(data.materialQty) * (CommonFunction.FormatCurrency(totalYield) || 1);
      data.totalYield = totalYield;
      data.needQty = needQty;
      rows.setData(data);
    }
    //
    if(this.id === "totalYield" || this.id === "materialQty"){
      let rows = this.cell.getRow(); 
      var data = rows.getNewData();
      let needQty = CommonFunction.FormatCurrency(data.materialQty) * (1 + CommonFunction.FormatCurrency(data.totalYield));
      data.needQty = Math.round(needQty);
      rows.setData(data);
    }

    if(this.id === "lossRate"){
      let rows = this.cell.getRow(); 
      var data = rows.getData();
      data[this.id] = CommonFunction.FormatCurrency(e.target.value);
      let planQty = CommonFunction.FormatCurrency(data.poQty) + ((CommonFunction.FormatCurrency(data.poQty) * CommonFunction.FormatCurrency(data.lossRate)/100));
      data.planQty = Math.round(planQty || 0);
      rows.setData(data);
    }
  }
}