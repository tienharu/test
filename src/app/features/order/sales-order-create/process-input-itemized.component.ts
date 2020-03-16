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
  selector: 'process-input-itemized',
  template: `
  <select select2 class="select2 parent_cd required" [name]="name" allowClear="true" #itemizedSelectComponent [(ngModel)]="cell.newValue"   (ngModelChange) = "onChange($event)" style="width:100%" [disabled]="!cell.isEditable()"
    (keydown.enter)="onEdited.emit($event)" 
    (keydown.esc)="onStopEditing.emit()" (click)="onEdit(cell)" required>
        <option *ngFor="let item of options" value="{{item.itemCd}}">{{item.itemDsplNm}}</option>
    </select>
`,
  styleUrls: ['../../../../assets/css/smart-table.scss', "./sales-order-create.component.css"]
})
export class CustomRenderSmartTableProcessInputItemizedComponent extends DefaultEditor implements OnInit {
  name: string = '';
  cate_cd: number;
  options: any[] = [];
  genunit: ItemMasterModel[] = [];
  itemizeds: GeneralMasterModel[] = [];
  stockUnits : GeneralMasterModel[]=[];
  bizUnits: GlobalMasterModel[] = [];
  @ViewChild('itemizedSelectComponent') itemizedSelectComponent: ElementRef;
  constructor(
    private saleOrderCreateService: SaleOrderCreateService,
    private globalMasterService: GlobalMasterService,
    public userService: AuthService,
    private generalMasterService: GeneralMasterService,){
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
    let itemN = this.genunit.find(p => p.itemCd == event)
    var rows = this.cell.getRow();
    rows.cells[6].newValue = itemN.itemDsplNm;
    rows.cells[7].newValue = itemN.itemizedGenCd;
    rows.cells[8].newValue = itemN.stockUnitGenCd;
    rows.cells[9].newValue = itemN.bizUnitId;

  }
  onEdit(e) {
    console.log("edit clicked", e)
  }

}