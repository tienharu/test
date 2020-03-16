import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemMenuRoutingModule } from './system-menu-routing.module';
import { SystemMenuComponent } from '@app/features/system/system-menu/system-menu.component';
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
    SystemMenuRoutingModule
  ],
  providers: [],
  declarations: [SystemMenuComponent]
})
export class SystemMenuModule { }
