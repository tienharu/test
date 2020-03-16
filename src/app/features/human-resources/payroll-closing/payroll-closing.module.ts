import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { PayrollClosingComponent } from './payroll-closing.component';
import { PayrollClosingRoutingModule } from './payroll-closing-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PayrollClosingRoutingModule,
    SmartadminDatatableModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SharedModule
  ],
  providers: [],
  declarations: [PayrollClosingComponent]
})
export class PayrollClosingModule { }