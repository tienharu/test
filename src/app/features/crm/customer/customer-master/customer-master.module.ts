import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerMasterRoutingModule } from './customer-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { CustomerMasterComponent } from './customer-master.component';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { CommonSharedModule } from '@app/shared/common/common-shared.module';
import { CustomerEditModule } from '../customer-edit/customer-edit.module';


@NgModule({
  imports: [
    CommonModule,
    CustomerMasterRoutingModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    CommonSharedModule,
    CustomerEditModule
  ],
  declarations: [CustomerMasterComponent]
})
export class CustomerMasterModule { }
