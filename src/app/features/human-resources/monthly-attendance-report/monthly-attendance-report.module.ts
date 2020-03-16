import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyAttendanceRoutingModule } from './monthly-attendance-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MonthlyAttendanceComponent } from './monthly-attendance.component';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    MonthlyAttendanceRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [],
  declarations: [MonthlyAttendanceComponent]
})
export class MonthlyAttendanceReportModule { }