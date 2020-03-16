import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendancePersonRoutingModule } from './attendance-person-routing';
import { SharedModule } from '@app/shared/shared.module';
import { AttendancePersonComponent } from './attendance-person.component';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    AttendancePersonRoutingModule,
    SharedModule,
    SmartadminInputModule,
    NgxPaginationModule,
  ],
  providers: [],
  declarations: [AttendancePersonComponent]
})
export class AttendancePersonModule { }