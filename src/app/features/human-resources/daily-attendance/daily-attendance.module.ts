import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyAttendanceRoutingModule } from './daily-attendance-routing';
import { SharedModule } from '@app/shared/shared.module';
import { DailyAttendanceComponent } from './daily-attendance.component';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    DailyAttendanceRoutingModule,
    SharedModule,
    SmartadminInputModule,
    NgxPaginationModule
  ],
  providers: [],
  declarations: [DailyAttendanceComponent]
})
export class DailyAttendanceModule { }