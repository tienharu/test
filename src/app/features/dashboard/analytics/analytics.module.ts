import {NgModule} from '@angular/core';

import {SharedModule} from '@app/shared/shared.module'

import {AnalyticsRoutingModule} from '@app/features/dashboard/analytics/analytics-routing.module';
import {AnalyticsComponent} from '@app/features/dashboard/analytics/analytics.component';
import {SocialNetworkComponent} from "@app/features/dashboard/analytics/live-feeds/social-network.component";
import {LiveFeedsComponent} from "@app/features/dashboard/analytics/live-feeds/live-feeds.component";
import {LiveStatsComponent} from "@app/features/dashboard/analytics/live-feeds/live-stats.component";
import {RevenueComponent} from "@app/features/dashboard/analytics/live-feeds/revenue.component";
import {BirdEyeComponent} from '@app/features/dashboard/analytics/bird-eye/bird-eye.component';
import { TodoWidgetComponent } from '@app/features/dashboard/analytics/todo-widget/todo-widget.component';
import { TodoListComponent } from '@app/features/dashboard/analytics/todo-widget/todo-list.component';
import {FlotChartModule} from "@app/shared/graphs/flot-chart/flot-chart.module";
import {D3Module} from "@app/shared/graphs/d3/d3.module";


@NgModule({
  imports: [
    SharedModule,
    AnalyticsRoutingModule,
    FlotChartModule,
    D3Module,
  ],
  declarations: [
    AnalyticsComponent,

    LiveFeedsComponent,
    LiveStatsComponent,
    RevenueComponent,
    SocialNetworkComponent,

    BirdEyeComponent,

    TodoWidgetComponent,

    TodoListComponent
  ],
  providers: [],
})
export class AnalyticsModule {

}
