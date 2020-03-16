import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DueOutMaterialComponent } from './due-out-material.component';
import { DueOutMaterialRoutingModule } from './due-out-material-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SearchWorkOrderMasterPopupModule } from '../work-order-master/popups/search-work-order-master-popup/search-work-order-master-popup.module';
import { CustomRenderSmartTableDueOutMaterialCheckboxComponent } from './due-out-material-checkbox-editor.component';
import { CustomRenderSmartTableDueOutMaterialInputComponent } from './due-out-material-input-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
    DueOutMaterialRoutingModule,
    SearchWorkOrderMasterPopupModule,
    
  ],
  declarations: [
    DueOutMaterialComponent ,CustomRenderSmartTableDueOutMaterialCheckboxComponent, CustomRenderSmartTableDueOutMaterialInputComponent
  ]
})
export class DueOutMaterialModule {}
