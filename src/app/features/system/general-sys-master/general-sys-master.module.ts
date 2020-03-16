import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralSysMasterRoutingModule } from './general-sys-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { GeneralSysMasterComponent } from '@app/features/system/general-sys-master/general-sys-master.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    GeneralSysMasterRoutingModule
  ],
  providers: [],
  declarations: [GeneralSysMasterComponent]
})
export class GeneralSysMasterModule { }
