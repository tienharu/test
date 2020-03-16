import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DutyTypeRoutingModule } from './duty-type-routing';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { DutyTypeComponent } from './duty-type.component';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    DutyTypeRoutingModule,
    SharedModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    SmartadminValidationModule,
    Ng2SmartTableModule
  ],
  providers: [],
  declarations: [DutyTypeComponent]
})
export class DutyTypeModule { }