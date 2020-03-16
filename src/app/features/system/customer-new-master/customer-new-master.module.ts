import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerNewMasterComponent } from './customer-new-master.component';
import { CustomerNewMasterRoutingModule } from './/customer-new-master-routing.module';
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
    CustomerNewMasterRoutingModule
  ],
  declarations: [CustomerNewMasterComponent]
})
export class CustomerNewMasterModule { }
