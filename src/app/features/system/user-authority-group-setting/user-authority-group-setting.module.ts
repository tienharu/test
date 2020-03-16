import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAuthorityGroupSettingRoutingModule } from './user-authority-group-setting-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { UserAuthorityGroupSettingComponent } from '@app/features/system/user-authority-group-setting/user-authority-group-setting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    UserAuthorityGroupSettingRoutingModule
  ],
  providers: [],
  declarations: [UserAuthorityGroupSettingComponent]
})
export class UserAuthorityGroupSettingModule { }
