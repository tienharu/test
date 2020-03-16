import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ContactorMasterComponent } from './contactor-master.component';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { ContactorMasterRoutingModule } from './contactor-master-routing.module';
import { CommonSharedModule } from '@app/shared/common/common-shared.module';
import { ContactorEditModule } from '../contactor-edit/contactor-edit.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    ContactorMasterRoutingModule,
    CommonSharedModule,
    ContactorEditModule
  ],
  providers: [
],
  declarations: [ContactorMasterComponent]
})
export class ContactorMasterModule { }
