import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftworkRegisterRoutingModule } from './shiftwork-register-routing.module';
import { ShiftworkRegisterComponent } from './shiftwork-register.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    ShiftworkRegisterRoutingModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
  ],
  declarations: [ShiftworkRegisterComponent]
})
export class ShiftworkRegisterModule { }
