import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupSharingSettingRoutingModule } from './group-sharing-setting-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { GroupSharingSettingComponent } from './group-sharing-setting.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    GroupSharingSettingRoutingModule
  ],
  declarations: [GroupSharingSettingComponent]
})
export class GroupSharingSettingModule { }
