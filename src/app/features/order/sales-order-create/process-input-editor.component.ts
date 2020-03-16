import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'process-input-editor',
  template: `
  <input type="text" [ngClass]="inputClass"   class="form-control required" [(ngModel)]="cell.newValue" [name]="name" required/>
`,
  styleUrls: ['../../../../assets/css/smart-table.scss',"./sales-order-create.component.css"]
})
export class CustomRenderSmartTableProcessInputComponent extends DefaultEditor implements OnInit {
  name:string = '';
  constructor() {
    super();
  }

  ngOnInit() {
  
  }

  onCellClick(e){
    e.target.select();
  }
}