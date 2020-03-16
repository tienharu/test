import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'input-editor',
  template: `<input type="number" [ngClass]="inputClass" class="form-control right" [(ngModel)]="cell.newValue" [name]="cell.getId()"
  [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
  (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
`,
  styleUrls: ['../../../../assets/css/smart-table.scss',"./overtime-table.component.css"]
})
export class CustomRenderSmartTableInputComponent extends DefaultEditor implements OnInit {

    @Input() value: string | number;
    @Input() rowData: any;

  constructor() {
    super();
  }

  ngOnInit() {
  }
  onCellClick(e){
    e.target.select();
  }
  
}