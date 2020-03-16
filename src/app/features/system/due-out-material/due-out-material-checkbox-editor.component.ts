import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'due-out-material-checkbox-editor',
  template: `<label class="atman-checkbox">
<input type="checkbox"  (click) ="checkValue($event)" [ngClass]="inputClass" class="form-control single-check" [(ngModel)]="cell.newValue" [name]="name"
[disabled]="!cell.isEditable()" (keydown.enter)="onEdited.emit($event)"
(keydown.esc)="onStopEditing.emit()"/><i></i></label>
`,
  styleUrls: ['../../../../assets/css/smart-table.scss', "../../order/sales-order-create/sales-order-create.component.css"]
})
export class CustomRenderSmartTableDueOutMaterialCheckboxComponent extends DefaultEditor implements OnInit {
  name: string = '';
  constructor() {
    super();
  }

  ngOnInit() {
    var id = this.cell.getId();
    var row = this.cell.getRow();

    let cells = this.cell.getRow().getCells();
    cells[11].getColumn().isEditable = false;
    // if (cells[11].getColumn().isEditable == true){
    //   console.log("Gia tri cua type DOOOOOO",typeof cells[11].getColumn().isEditable);
    // }

    this.name = id;
    if (row && row.index === -1) {
      this.name += '_' + (row.index + 1);
    }
  }

  // onClick(event){
  //   console.log("Gia tri onclick",event);
  // }
  onCellClick(e){
    e.target.select();
  }
  onEdit(e) {
  }
  checkValue(event:any){
    let cells = this.cell.getRow().getCells();
     cells[11].getColumn().isEditable = true;
    // this.cell.getRow().getCells[11].getColumn().isEditable = true;
    // var rows = this.cell.getRow();
    // rows.cells[1].newValue = 1;
  }

}