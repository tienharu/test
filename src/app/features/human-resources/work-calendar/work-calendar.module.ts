import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkCalendarRoutingModule } from './work-calendar-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkCalendarComponent } from './work-calendar.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    WorkCalendarRoutingModule,
    SharedModule,
    Ng2SmartTableModule
  ],
  providers: [],
  declarations: [WorkCalendarComponent]
})
export class WorkCalendarModule { }