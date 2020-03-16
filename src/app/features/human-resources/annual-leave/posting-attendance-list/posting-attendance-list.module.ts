import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '@app/shared/shared.module';

import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { PostingAttendanceListComponent } from './posting-attendance-list.component';
import { PostingAttendanceListRoutingModule } from './posting-attendance-list-routing.module';



@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    SmartadminDatatableModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    
    PostingAttendanceListRoutingModule
  ],
  declarations: [
    PostingAttendanceListComponent,
  ]
})
export class PostingAttendanceListModule { }