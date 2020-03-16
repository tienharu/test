import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyOvertimeRoutingModule } from './monthly-overtime-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MonthlyOvertimeComponent } from './monthly-overtime.component';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    MonthlyOvertimeRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [],
  declarations: [MonthlyOvertimeComponent]
})
export class MonthlyOvertimeReportModule { }