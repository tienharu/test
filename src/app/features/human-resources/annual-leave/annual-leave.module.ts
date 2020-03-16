import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '@app/shared/shared.module';
import { AnnualLeaveComponent } from './annual-leave.component';
import { AnnualLeaveRoutingModule } from './annual-leave-routing.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    SmartadminDatatableModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    
    AnnualLeaveRoutingModule,
  ],
  declarations: [
    AnnualLeaveComponent,
    
  ]
})
export class AnnualLeaveModule { }