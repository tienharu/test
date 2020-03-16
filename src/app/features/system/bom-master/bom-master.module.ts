import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BomMasterComponent } from './bom-master.component';
import { BomMasterRoutingModule } from './/bom-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxCurrencyModule } from 'ngx-currency';
import { CustomBomSelectEditorComponent } from './bom-select-editor.component';
import { CustomBomInputEditorComponent } from './bom-input-editor.component';
import { BomCompItemComponent } from './bom-component-item/bom-component-item.component';
import { BomMasterPopupModule } from '../bom-master-popup/bom-master-popup.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    BomMasterRoutingModule,
    Ng2SmartTableModule,
    NgxCurrencyModule,
    BomMasterPopupModule,
  ],
  declarations: [BomMasterComponent, CustomBomSelectEditorComponent, CustomBomInputEditorComponent, BomCompItemComponent]
})
export class BomMasterModule { }
