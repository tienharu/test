import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import { AuthService } from '@app/core/services';
import _ from 'lodash';
import { O_APPEND } from 'constants';

@Component({
    selector: 'transaction-select-editor',
    template: `
<label class="input">
    <select select2 class="select2" [name]="name" allowClear="true" [(ngModel)]="cell.newValue" (ngModelChange)="onChange($event)"  style="width:100%" 
    (keydown.enter)="onEdited.emit($event)" 
    (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)">
        <option *ngFor="let item of options" value={{item.id}}>{{item.text}}</option>
    </select>
</label>
`,
    styleUrls: ['../../../../assets/css/smart-table.scss', "./transaction-code-box.component.css"]
})
export class CustomRenderSmartTableTransactionSelect2Component extends DefaultEditor implements OnInit {
    name: string = '';
    options: any[] = [];
    id: string = '';
    constructor(
        public userService: AuthService,
    ) {
        super();
    }
    ngOnInit() {
        var id = this.cell.getId();
        this.id = id;
        var editor = this.cell.getColumn().editor;
        this.options = (editor.config && editor.config.list) || [];
        var row = this.cell.getRow();
        this.name = id;
        if (row && row.index === -1) {
            this.name += '_' + (row.index + 1);
        }
    }

    onEdit(e) {
    }

    onChange(event) {
        if (this.id === "companyacctcd") {
            let rows = this.cell.getRow();
            var data = rows.getNewData();
            data.companyacctcd_id = event;
            rows.setData(data);
        }
    }
}
