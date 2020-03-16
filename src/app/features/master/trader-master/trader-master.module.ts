import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraderMasterRoutingModule } from './trader-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { TraderMasterComponent } from './trader-master.component';


@NgModule({
  imports: [
    CommonModule,
    TraderMasterRoutingModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    TraderMasterRoutingModule
  ],
  providers: [],
  declarations: [TraderMasterComponent]
})
export class TraderMasterModule { }
