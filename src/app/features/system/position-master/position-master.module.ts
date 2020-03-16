import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionMasterRoutingModule } from './position-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { PositionMasterComponent } from '@app/features/system/position-master/position-master.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    PositionMasterRoutingModule
  ],
  providers: [],
  declarations: [PositionMasterComponent]
})
export class PositionMasterModule { }
