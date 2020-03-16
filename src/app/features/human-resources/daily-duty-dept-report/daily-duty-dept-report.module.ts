import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyDutyByDeptRoutingModule } from './daily-duty-dept-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DailyDutyByDeptComponent } from './daily-duty-dept.component';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    DailyDutyByDeptRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule,
    SmartadminInputModule
  ],
  providers: [],
  declarations: [DailyDutyByDeptComponent]
})
export class DailyDutyByDeptReportModule { }