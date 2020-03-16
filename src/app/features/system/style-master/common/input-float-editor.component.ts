import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';
import _ from 'lodash';

@Component({
  selector: 'style-input-float-editor',
  template: `
  <label class="input">
  <input type="text" currencyMask [options]="{prefix:'', thousands: ',', decimal: '.' , allowNegative : false }" (blur)="calculateAmount($event)" class="form-control" [(ngModel)]="cell.newValue" [name]="name"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
  </label>
  `,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "../style-master.component.css"]
})
export class CustomRenderSmartTableStyleInputFloatComponent extends DefaultEditor implements OnInit {
  name: string = '';
  id: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    var self = this;
    var id = self.cell.getId();
    var row = self.cell.getRow();
    self.name = id;
    self.id = id;
    if (row && row.index === -1) {
      self.name += '_' + (row.index + 1);
    }
  }

  onCellClick(e) {
    e.target.select();
  }

  calculateAmount(e){
    if(this.id === "netYield" || this.id === "lostYield" || this.id === "lossYield"){
      let rows = this.cell.getRow(); 
      var data = rows.getNewData();
      var old  = rows.getData();
      old.netYield = CommonFunction.FormatCurrency(data.netYield);
      if(data.lostYield !== undefined){
        old.lostYield = CommonFunction.FormatCurrency(data.lostYield);
        let totalYield =  old.netYield  + old.lostYield;
        old.totalYield = totalYield;
        old.constructionGenCd = data.constructionGenCd;
      }
      if(data.lossYield !== undefined){
        old.lossYield = CommonFunction.FormatCurrency(data.lossYield);
        let totalYield =  old.netYield  + old.lossYield;
        old.totalYield = totalYield;
      }
      if(data.materialQty !== undefined){
        let needQty = CommonFunction.FormatCurrency(data.materialQty) * (CommonFunction.FormatCurrency(old.totalYield) || 1);
        old.needQty = Math.round(needQty);
      }
      rows.setData(old);
    }

    if(this.id === "totalYield"){
      let rows = this.cell.getRow(); 
      var data = rows.getNewData();
      var old  = rows.getData();
      _.extend(old, data);
      let needQty = CommonFunction.FormatCurrency(old.materialQty) * (1 + CommonFunction.FormatCurrency(old.totalYield));
      old.needQty = Math.round(needQty);
      rows.setData(old);
    }
  }
}