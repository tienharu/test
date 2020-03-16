import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeePrintCardRoutingModule } from './employee-print-card-routing.module';
import { EmployeePrintCardComponent } from './employee-print-card.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminInputModule,
    EmployeePrintCardRoutingModule
  ],
  declarations: [EmployeePrintCardComponent]
})
export class EmployeePrintCardModule { }
