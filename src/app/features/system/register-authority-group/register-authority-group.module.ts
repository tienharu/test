import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterAuthorityGroupRoutingModule } from './register-authority-group-routing.module';
import { RegisterAuthorityGroupComponent } from './register-authority-group.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    RegisterAuthorityGroupRoutingModule
  ],
  providers: [],
  declarations: [RegisterAuthorityGroupComponent]
})
export class RegisterAuthorityGroupModule { }
