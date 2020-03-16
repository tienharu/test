import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { StyleMasterBreakDownPopupModule } from '../../popups/style-master-breakdown-popup/style-master-breakdown-popup.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
  imports: [
    CommonModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    SharedModule,
    Ng2SmartTableModule,
    StyleMasterBreakDownPopupModule,
  ],
 
  declarations: []
})
export class POMaterialModule { }
