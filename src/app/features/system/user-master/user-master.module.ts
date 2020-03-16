import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserMasterRoutingModule } from './user-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { UserMasterComponent } from '@app/features/system/user-master/user-master.component';
import { ResetUserPasswordComponent } from './reset-pass.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    UserMasterRoutingModule,
    
  ],
  providers: [],
  declarations: [UserMasterComponent,ResetUserPasswordComponent]
})
export class UserMasterModule { }
