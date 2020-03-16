import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DefaultEditor, ViewCell } from 'ng2-smart-table';
import { SalesOrderCreateItemizedModel } from '@app/core/models/sale-order-create.model';
import { SaleOrderCreateService } from '@app/core/services/features.services/sale-order-create.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { ItemMasterModel } from '@app/core/models/item-master.model';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { AuthService } from '@app/core/services';
import { Category, ProgramList } from '@app/core/common/static.enum';

@Component({
  selector: 'process',
  template: `
  <label class="input">
  <select select2 class="select2 parent_cd required" [name]="name" allowClear="true" #itemizedSelectComponent [(ngModel)]="cell.newValue"   (ngModelChange) = "onChange($event)" style="width:100%" [disabled]="!cell.isEditable()"
    (keydown.enter)="onEdited.emit($event)" 
    (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)" required>
        <option *ngFor="let item of options" value="{{item.gen_cd}}">{{item.gen_nm}}</option>
    </select>
    </label>
`,
  styleUrls: ['../../../../assets/css/smart-table.scss', "./approval-line-registration.component.css"]
})
export class CustomProcessComponent extends DefaultEditor implements OnInit {
  name: string = '';
  cate_cd: number;
  options: any[] = [];
  genunit: GeneralMasterModel[] = [];
  @ViewChild('itemizedSelectComponent') itemizedSelectComponent: ElementRef;
  constructor(
    public userService: AuthService,
    private generalMasterService: GeneralMasterService, ) {
    super();
    this.cate_cd = Category.OrgCateCode;
  }

  ngOnInit() {
    var id = this.cell.getId();
    var editor = this.cell.getColumn().editor;
    this.options = (editor.config && editor.config.list) || [];
    this.genunit = (editor.config && editor.config.list) || [];
  }

  onCellClick(e) {
    e.target.select();
  }
  onChange(event) {
    var rows = this.cell.getRow();
    rows.cells[0].newValue = event;

  }
  onEdit(e) {
    // console.log("edit clicked", e)
  }

}