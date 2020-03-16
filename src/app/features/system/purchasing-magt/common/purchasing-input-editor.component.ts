import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'purchasing-input-editor',
  template: `
  <input type="number" class="inputClass" [(ngModel)]="cell.newValue" class="form-control"/>
`,
  styleUrls: ['../../../../../assets/css/smart-table.scss',"../purchasing-magt.component.css"]
})
export class CustomPurchasingInputEditorComponent extends DefaultEditor implements OnInit {
  name:string = '';
  patternRegx = /^\d+$/;
  //
  currency: boolean =false;
  currencyOptions: any = {};
  constructor() {
    super();
  }

  ngOnInit() {
    
  }

  onCellClick(e){
    e.target.select();
  }
}