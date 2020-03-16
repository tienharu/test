import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'input-editor',
  template: `
  <label class="input" style="padding: 0;">
                              <select select2 class="select2" name="cell.getId" [(ngModel)]="inputModel" style="width:100%" [disabled]="!cell.isEditable()"
                               (keydown.enter)="onEdited.emit($event)" 
                              (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)">
                                  <option *ngFor="let item of hrlistz" value="{{item.value}}">{{item.title}}</option>
                              </select>
                          </label>
`,
  styleUrls: ['../../../../assets/css/smart-table.scss',"./overtime-table.component.css"]
})
export class CustomRenderSmartTableSelectComponent extends DefaultEditor implements OnInit {
  renderValue: string;
    // @Input() value: string | number;
    // @Input() rowData: any;
    inputModel: any;
    hrlistz : any[] = [];
  constructor() {
    super();
  }

  ngOnInit() {
    this.hrlistz =this.cell.getColumn().filter.config.list;
    this.inputModel = this.cell.getId();
  // console.log("this.cell.getColumn",this.cell.getColumn().filter.config.list);
  // console.log("this.cell.getId",this.cell.getId());
  // console.log("this.cell.getId2",this.cell.getRow().cells[1].getId());
  // console.log("this.cell.getRow",this.cell.getRow());
  // console.log("this.cell.getTitle",this.cell.getTitle());
  // console.log("this.cell.getValue",this.cell.getValue());
  // console.log("this.cell.setValue",this.cell.setValue)
  }
  
  onEdit(e){
    // e.target.select();
    console.log("edit clicked",e)
  }
  
}

@Component({
  template: `{{value}}`,
})
export class CustomRenderSmartTableSelectzComponent implements ViewCell, OnInit {
  @Input() value: string;
  @Input() rowData: any;

  constructor() { }

  ngOnInit() { }

}