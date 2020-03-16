import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdidasMonthlyTurnoverRoutingModule } from './adidas-monthly-turnover-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AdidasMonthlyTurnoverComponent } from './adidas-monthly-turnover.component';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    AdidasMonthlyTurnoverRoutingModule,
    Ng2SmartTableModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [],
  declarations: [AdidasMonthlyTurnoverComponent]
})
export class AdidasMonthlyTurnoverModule { }