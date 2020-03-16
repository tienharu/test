import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
@Component({
    selector: 'purchasing-select-editor',
    template: `
  <label class="input">
    <select select2 class="select2" [name]="name" allowClear="true" [(ngModel)]="cell.newValue" style="width:100%"
    (keydown.enter)="onEdited.emit($event)" 
    (keydown.esc)="onStopEditing.emit()">
        <option *ngFor="let item of options" value={{item.id}}>{{item.text}}</option>
    </select>
</label>
`,
    styleUrls: ['../../../../../assets/css/smart-table.scss', "../purchasing-magt.component.css"]
})
export class CustomPurchasingSelectEditorComponent extends DefaultEditor implements OnInit {
    name: string = '';
    options: any[] = [];
    constructor(
    ) {
        super();
    }

    ngOnInit() {
        var id = this.cell.getId();
        var editor = this.cell.getColumn().editor;
        this.options = (editor.config && editor.config.list) || [];
        var row = this.cell.getRow();
        this.name = id;
        if (row && row.index === -1) {
            this.name += '_' + (row.index + 1);
        }
    }
}
