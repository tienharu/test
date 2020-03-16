import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';
import _ from 'lodash';

@Component({
  selector: 'purchasing-input-currency-editor',
  template: `
  <label class="input">
  <input type="text" currencyMask [options]="{prefix:'', suffix:'', precision : 0, allowNegative : false }" (blur)="calculateAmount($event)" class="form-control" [(ngModel)]="cell.newValue" [name]="name"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
  </label>
  `,
  styleUrls: ['../../../../../assets/css/smart-table.scss',"../purchasing-magt.component.css"]
})
export class CustomPurchasingInputCurrencyEditorComponent extends DefaultEditor implements OnInit {
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
    if(this.id === "inQty"){
      let rows = this.cell.getRow(); 
      var data = rows.getData();
      data[this.id] = Number(e.target.value);
      let balQty = Number(data.poQty) - (Number(data.inedQty) + Number(data.inQty));
      if(balQty < 0){
        data.inQty = data.poQty - data.inedQty;
        balQty = 0;
      }
      data.balQty = balQty;
      if(!data.inedQty && !data.inQty){
        data.purchLineStatus = 'Not Yet';
      }else if(data.balQty > 0){
        data.purchLineStatus = 'Ing';
      }else if(data.balQty <= 0){
        data.purchLineStatus = 'Finished';
      }
      let purchAmount =  Number(data.actPrice) * Number(data.inQty);
      data.purchAmount = purchAmount;
      rows.setData(data);
    }
    //
    if(this.id === "actPrice"){
      let rows = this.cell.getRow(); 
      var data = rows.getData();
      data[this.id] = Number(e.target.value);
      let purchAmount =  Number(data.actPrice) * Number(data.inQty || 0);
      data.purchAmount = purchAmount;
      rows.setData(data);
    }

  }
}