import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
@Component({
  selector: 'work-order-input-editor',
  template: `
    <label class="input">
        <input type="text"  style="text-align: center !important" [ngClass]="inputClass" class="form-control" [(ngModel)]="cell.newValue" [saUiDatepicker]="{dateFormat: 'yy.mm.dd'}" autocomplete="off" [name]="name"
        [disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
        (keydown.esc)="onStopEditing.emit()" (click)="onCellClick($event)" />
    </label>
  `,
  styleUrls: ['../../../../../assets/css/smart-table.scss', "../work-order-master.component.css"]
})
export class CustomRenderSmartTableWorkOrderInputDateComponent extends DefaultEditor implements OnInit {
  name: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    var id = this.cell.getId();
    var row = this.cell.getRow();
    this.name = id;
    if (row && row.index === -1) {
      this.name += '_' + (row.index + 1);
    }
  }

  onCellClick(e) {
    e.target.select();
  }
}