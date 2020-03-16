import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404RoutingModule } from '@app/features/error/error404/error404-routing.module';
import { Error404Component } from '@app/features/error/error404/error404.component';
import { SmartadminLayoutModule } from '@app/shared/layout';
import { StatsModule } from '@app/shared/stats/stats.module';



@NgModule({
  imports: [
    CommonModule,
    Error404RoutingModule,

    SmartadminLayoutModule,
		StatsModule,
  ],
  declarations: [Error404Component]
})
export class Error404Module { }
