import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GvnMonthlyAttendanceRoutingModule } from './gvn-monthly-attendance-routing.module';
import { GvnMonthlyAttendanceComponent } from './gvn-monthly-attendance.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GvnMonthlyAttendanceRoutingModule
  ],
  declarations: [GvnMonthlyAttendanceComponent]
})
export class GvnMonthlyAttendanceModule { }
