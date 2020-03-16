import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DefaultEditor, Cell} from 'ng2-smart-table';
import _ from 'lodash';
@Component({
    selector: 'style-select-editor',
    template: `
<label class="input">
    <select select2 class="select2" [name]="name" allowClear="true" [(ngModel)]="cell.newValue" [disabled]="isEdit" (ngModelChange)="onChange($event)" style="width:100%" [disabled]="!cell.isEditable()"
    (keydown.enter)="onEdited.emit($event)" 
    (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)">
        <option *ngFor="let item of options" value={{item.id}}>{{item.text}}</option>
    </select>
</label>
`,
    styleUrls: ['../../../../../assets/css/smart-table.scss', "../purch-order.component.css"]
})
export class CustomRenderSmartTableStyleSelect2PurchOrderComponent extends DefaultEditor implements OnInit,AfterViewInit {
    name: string = '';
    options: any[] = [];
    id: string = '';
    isEdit: boolean = false;
    // fieldDisableEditor = (cell: Cell) => {
    //     cell.getColumn().isEditable = false;
    //     cell.newValue = '';
    // }
    // fieldEnableEditor = (cell: Cell) => {
    //     cell.getColumn().isEditable = true;
    // } 
    constructor() {
        super();
    }
    ngOnInit() {
        var id = this.cell.getId();
        this.id = id;
        var editor = this.cell.getColumn().editor;     
        this.options = (editor.config && editor.config.list) || [];
        this.name = id;
    }

    ngAfterViewInit() {
        let cells = this.cell.getRow().getCells();
        let idxRow = this.cell.getRow().index;
        setTimeout(() => {
            if (this.cell.newValue) {
                (<HTMLInputElement>document.getElementById(cells[10].getId() + idxRow)).disabled = false;
                (<HTMLInputElement>document.getElementById(cells[11].getId() + idxRow)).disabled = false;
                (<HTMLInputElement>document.getElementById(cells[14].getId() + idxRow)).disabled = false;
            } else {
                (<HTMLInputElement>document.getElementById(cells[10].getId() + idxRow)).disabled = true;
                (<HTMLInputElement>document.getElementById(cells[11].getId() + idxRow)).disabled = true;
                (<HTMLInputElement>document.getElementById(cells[14].getId() + idxRow)).disabled = true;
            }
        }, 80);
    }

    onEdit(e) {
    }

    onChange(event) {
        let cells = this.cell.getRow().getCells();
        let idxRow = this.cell.getRow().index;
        if (event === null) {
            (<HTMLInputElement>document.getElementById(cells[10].getId() + idxRow)).disabled = true;
            (<HTMLInputElement>document.getElementById(cells[11].getId() + idxRow)).disabled = true;
            (<HTMLInputElement>document.getElementById(cells[14].getId() + idxRow)).disabled = true;
        } else {
            (<HTMLInputElement>document.getElementById(cells[10].getId() + idxRow)).disabled = false;
            (<HTMLInputElement>document.getElementById(cells[11].getId() + idxRow)).disabled = false;
            (<HTMLInputElement>document.getElementById(cells[14].getId() + idxRow)).disabled = false;
        }
    }
}
