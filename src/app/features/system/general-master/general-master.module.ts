import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralMasterRoutingModule } from './general-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { GeneralMasterComponent } from '@app/features/system/general-master/general-master.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    GeneralMasterRoutingModule
  ],
  providers: [],
  declarations: [GeneralMasterComponent]
})
export class GeneralMasterModule { }
