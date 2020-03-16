import { Component, OnInit} from '@angular/core';
import { DefaultEditor} from 'ng2-smart-table';
@Component({
  selector: 'style-checkbox-editor',
  template: `<label class="atman-checkbox">
<input type="checkbox" [checked]="cell.newValue" (change) ="checkValue($event)" [ngClass]="inputClass" class="form-control single-check" [(ngModel)]="cell.newValue" [name]="name"
 (keydown.enter)="onEdited.emit($event)"
(keydown.esc)="onStopEditing.emit()"/><i></i></label>
`,
styleUrls: ['../../../../../assets/css/smart-table.scss', "../style-master.component.css"]
})
export class CustomRenderSmartTableStyleInputCheckboxComponent extends DefaultEditor implements OnInit {
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

  onCellClick(e){
    e.target.select();
  }

  onEdit(e) {
  }

  checkValue(event:any){
  }
}