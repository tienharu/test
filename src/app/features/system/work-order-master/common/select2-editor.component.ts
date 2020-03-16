import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { AuthService } from '@app/core/services';
import _ from 'lodash';
@Component({
    selector: 'work-order-select-editor',
    template: `
    <label class="input">
        <select select2 class="select2" [name]="name" allowClear="true" [(ngModel)]="cell.newValue" [disabled]="isEdit" (ngModelChange)="onChange($event)" style="width:100%" [disabled]="!cell.isEditable()"
        (keydown.enter)="onEdited.emit($event)" 
        (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)">
            <option *ngFor="let item of options" value={{item.id}}>{{item.text}}</option>
        </select>
    </label>
    `,
    styleUrls: ['../../../../../assets/css/smart-table.scss', "../work-order-master.component.css"]
})
export class CustomRenderSmartTableWorkOrderSelect2Component extends DefaultEditor implements OnInit {
    name: string = '';
    options: any[] = [];
    id: string = '';
    isEdit: boolean = false;
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
    }
}
