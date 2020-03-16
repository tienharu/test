import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error403RoutingModule } from '@app/features/error/error403/error403-routing.module';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { StatsModule } from '@app/shared/stats/stats.module';
import { Error403Component } from './error403.component';



@NgModule({
  imports: [
    CommonModule,
    Error403RoutingModule,

    SmartadminLayoutModule,
		StatsModule,
  ],
  declarations: [Error403Component]
})
export class Error403Module { }
