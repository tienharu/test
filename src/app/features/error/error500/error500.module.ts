import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error500RoutingModule } from '@app/features/error/error500/error500-routing.module';
import { Error500Component } from '@app/features/error/error500/error500.component';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { StatsModule } from '@app/shared/stats/stats.module';


@NgModule({
  imports: [
    CommonModule,
    Error500RoutingModule,


    SmartadminLayoutModule,
		StatsModule,

  ],
  declarations: [Error500Component]
})
export class Error500Module { }
