import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdidasMonthlyOvertimeRoutingModule } from './adidas-monthly-overtime-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AdidasMonthlyOvertimeComponent } from './adidas-monthly-overtime.component';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    AdidasMonthlyOvertimeRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [],
  declarations: [AdidasMonthlyOvertimeComponent]
})
export class AdidasMonthlyOvertimeModule { }