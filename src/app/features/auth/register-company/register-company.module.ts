import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterCompanyRoutingModule } from './register-company-routing.module';
import { FormsModule } from '@angular/forms';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { RegisterCompanyComponent } from '@app/features/auth/register-company/register-company.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    FormsModule,
    RegisterCompanyRoutingModule,
    SmartadminValidationModule
  ],
  declarations: [RegisterCompanyComponent]
})
export class RegisterCompanyModule { }
