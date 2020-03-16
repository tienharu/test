import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyDutyRoutingModule } from './daily-duty-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DailyDutyComponent } from './daily-duty.component';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    DailyDutyRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule,
    SmartadminInputModule
  ],
  providers: [],
  declarations: [DailyDutyComponent]
})
export class DailyDutyReportModule { }