import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'process-input-mps',
  template: `

  
  <select id="filerByActiveYN" class="form-control select-filter"  [(ngModel)]="cell.newValue" [ngClass]="inputClass"  style="width: 100%;">
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>

`,
  styleUrls: ['../../../../assets/css/smart-table.scss',]
})
export class CustomRenderSmartTableProcessInputMPSComponent extends DefaultEditor implements OnInit {
  name:string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    console.log("Gia tri cua Input MPS")
  }

  onCellClick(e){
    e.target.select();
  }
}