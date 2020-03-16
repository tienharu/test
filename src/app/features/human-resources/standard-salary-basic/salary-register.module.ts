import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalaryRegisterRoutingModule } from './salary-register-routing.module';
import { SalaryRegisterComponent } from './salary-register.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SalaryDataComponent } from './salary-update.component';
import { SalaryCreateDataComponent } from './salary-create.component';

@NgModule({
  imports: [
    CommonModule,
    SalaryRegisterRoutingModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
  ],
  declarations: [SalaryRegisterComponent,SalaryDataComponent,SalaryCreateDataComponent]
})
export class SalaryRegisterModule { }
