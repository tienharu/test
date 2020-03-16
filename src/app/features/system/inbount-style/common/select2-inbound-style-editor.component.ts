import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DefaultEditor} from 'ng2-smart-table';
import _ from 'lodash';
import { InboundStyleService } from '@app/core/services/inbound-style.service';
import { WorkOrderMasterService } from '@app/core/services/features.services/work-order-master.service';
import { CommonFunction } from '@app/core/common/common-function';
@Component({
    selector: 'style-select-editor',
    template: `
<label class="input">
    <select select2 class="select2" [name]="name" allowClear="true" [(ngModel)]="cell.newValue" [disabled]="isEdit" (ngModelChange)="onChange($event)" style="width:100%" [disabled]="!cell.isEditable()"
        (keydown.enter)="onEdited.emit($event)" (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)">
        <option *ngFor="let item of options" value={{item.id}}>{{item.text}}</option>
    </select>
</label>
`,
    styleUrls: ['../../../../../assets/css/smart-table.scss', "./../inbount-style.component.css"]
})
export class CustomRenderSmartTableSelect2InboundStyleComponent extends DefaultEditor implements OnInit,AfterViewInit {
    name: string = '';
    options: any;
    isEdit: boolean = false;
    constructor(
        private inboundStyleService: InboundStyleService,
        private workOrderMasterService: WorkOrderMasterService
    ) {
        super();
    }
    ngOnInit() {
        var id = this.cell.getId();
        var editor = this.cell.getColumn().editor;     
        this.name = id;
        if (id === 'colorId') {
            this.options = this.inboundStyleService.getColor();
        } else {
            this.options = this.inboundStyleService.getSize().map(item => { return { id: item.sizeId, text: item.sizeId}});
        }
    }

    ngAfterViewInit() {
    }

    onEdit(e) {
    }

    onChange(event) {
        let cells = this.cell.getRow().getCells();
        let colorValue = cells[1].newValue;
        let sizeValue = cells[2].newValue;
        if (colorValue && sizeValue) {
            const receivedData = _.find(this.inboundStyleService.getReceivedData(), item => item.colorId === parseInt(colorValue) && item.sizeId === parseInt(sizeValue));
            let planQty = _.find(this.workOrderMasterService.getWorkOrderCSModel(), item => item.colorId === parseInt(colorValue) && item.sizeId === parseInt(sizeValue)).planQty;
            let received = receivedData ? receivedData.received : 0;
            cells[3].newValue = CommonFunction.FormatMoney(planQty);
            cells[4].newValue = received ? CommonFunction.FormatMoney(received) : 0;
            cells[6].newValue = CommonFunction.FormatMoney(planQty - received - cells[5].newValue);
        } else {
            cells[3].newValue = null;
            cells[4].newValue = null;
            cells[6].newValue = null;
        }
    }
}
