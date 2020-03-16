import { Component, OnInit} from '@angular/core';
import { DefaultEditor} from 'ng2-smart-table';
import { CommonFunction } from '@app/core/common/common-function';
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
    styleUrls: ['../../../../../assets/css/smart-table.scss', "../style-master.component.css"]
})
export class CustomRenderSmartTableStyleSelect2Component extends DefaultEditor implements OnInit {
    name: string = '';
    options: any[] = [];
    stockUnits: any = [];
    specMasters: any = [];
    materials: any = [];
    destinations: any = [];
    yields: any = [];
    isMain: boolean = false;
    id: string = '';
    isEdit: boolean = false;
    constructor() {
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
        }else{
           
            if (id === 'materialCd' || id === 'colorIdStyle') {  this.isEdit= true;}
        }

        if (id === 'destinationGenCd') {
            this.destinations = (editor.config && editor.config.destinations) || [];
        }

        if (id === 'materialCd') {
            this.stockUnits = (editor.config && editor.config.stockUnits) || [];
            this.specMasters = (editor.config && editor.config.specMasters) || [];
            this.materials = (editor.config && editor.config.materials) || [];
        }

        if (id === 'constructionGenCd') {
            this.yields = (editor.config && editor.config.yields) || [];
            this.isMain = (editor.config && editor.config.main) || false;
        }
    }

    onEdit(e) {
    }

    onChange(event) {
        if (this.id === "materialCd") {
            let rows = this.cell.getRow();
            var data = rows.getNewData();
            var old  = rows.getData();
            _.extend(old, data);
            old[this.id] = Number(event);
            var material = _.find(this.materials, function (r) {
                return r.materialSeq === old.materialCd;
            });
            if (material) {
                var unit = _.find(this.stockUnits, { "gen_cd": material.stockUnitGenCd });
                if (unit) {
                    old.unit = unit.gen_nm || '';
                }
                var spec = _.find(this.specMasters, { "gen_cd": material.specGenCd });
                if (spec) {
                    old.specWidth = spec.gen_nm || '';
                }
            }
            rows.setData(old);
        }
        if (this.id === "destinationGenCd") {
            let rows = this.cell.getRow();
            var data = rows.getNewData();
            var old  = rows.getData();
            _.extend(old, data);
            old[this.id] = Number(event);
            var destination  = _.find(this.destinations, { "gen_cd": data.destinationGenCd });
            if (destination) {
                old.price = destination.number_value_1 || 0;
                let amount = CommonFunction.FormatCurrency(old.price) * CommonFunction.FormatCurrency(old.poQty);
                old.amount = amount;
            }
            rows.setData(old);
        }
        if (this.id === "constructionGenCd" && this.isMain) {
            let rows = this.cell.getRow();
            var data = rows.getNewData();
            var old  = rows.getData();
            _.extend(old, data);
            old[this.id] = event;
            var conData = _.find(this.options, function (item) {
                return item.id === event;
            });
            if (conData && (conData.text.toLowerCase() === 'combo' || conData.id === '401000000000')) {
                var yieldData = _.find(this.yields, function (item) {
                    return item.constructionGenCd === event;
                });
                if (yieldData) {
                    old.netYield = yieldData.netYield;
                    old.lossYield = yieldData.lostYield;
                    let totalYield = CommonFunction.FormatCurrency(old.netYield) + CommonFunction.FormatCurrency(old.lossYield);
                    let needQty = CommonFunction.FormatCurrency(old.materialQty) * (CommonFunction.FormatCurrency(totalYield) || 1);
                    old.totalYield = totalYield;
                    old.needQty = needQty;
                }
            }
            rows.setData(old);
        }
    }
}
