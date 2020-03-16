import { Component, OnInit, Input } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import { RoutingMasterService } from '@app/core/services/features.services/routing-master.service';
import _ from 'lodash';
@Component({
    selector: 'process-select-editor',
    template: `
  <label class="input" style="padding: 0;">
    <select select4 class="select2" [options]="options" placeHolder="Select Routing Name" [name]="name" [(ngModel)] = "cell.newValue" style="width:100%" [disabled]="!cell.isEditable()"
    (keydown.enter)="onEdited.emit($event)" 
    (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)">
    </select>
</label>
`,
    styleUrls: ['../../../../assets/css/smart-table.scss', "./sales-order-create.component.css"]
})
export class CustomRenderSmartTableProcessSelectComponent extends DefaultEditor implements OnInit {
    name: string = '';
    options: any = {};
    constructor(
        private routingMasterService: RoutingMasterService
        ) {
        super();
    }

    ngOnInit() {
        var self = this;
        self.options = {
            AllowClear: true,
            ajax: {
                dataType: 'json',
                delay: 250,
                transport: function (params, success, failure) {
                    var $request = self.routingMasterService.listRoutingMasterAll();
                    $request.then(success, failure);
                    return $request;
                  },
                  data: function (params) {
                    return {
                      term: params.term,
                    };
                  },
                  processResults: function (data) {
                    var result = _.map(data, (item) => {
                        item.id = item.routeId;
                        item.text = item.routeName;
                        return item;
                    });
                    return {
                      results: result,
                    };
                  },
            }
        }
        var id = this.cell.getId();
        var row = this.cell.getRow();
        this.name = id;
        if (row && row.index === -1) {
            this.name += '_' + (row.index + 1);
        }
    }

    onEdit(e) {
        // e.target.select();
        console.log("edit clicked", e)
    }

}
