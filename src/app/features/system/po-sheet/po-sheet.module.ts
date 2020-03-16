import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoSheetComponent } from './po-sheet.component';
import { PoSheetRoutingModule } from './po-sheet-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PoSheetPopupModule } from './popups/po-sheet-popup/po-sheet-popup.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    Ng2SmartTableModule,
    PoSheetRoutingModule,
    PoSheetPopupModule
  ],
  declarations: [PoSheetComponent]
})
export class PoSheetModule { }
