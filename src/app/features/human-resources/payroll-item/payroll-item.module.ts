import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollItemRoutingModule } from './payroll-item-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { PayrollItemComponent } from './payroll-item.component';

@NgModule({
  imports: [
    CommonModule,
    PayrollItemRoutingModule,
    SmartadminDatatableModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SharedModule
  ],
  providers: [],
  declarations: [PayrollItemComponent]
})
export class PayrollItemModule { }