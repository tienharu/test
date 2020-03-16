
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import { EasyPieChartContainer } from '@app/shared/graphs/inline/easy-pie-chart-container.directive'
import { SparklineContainer } from '@app/shared/graphs/inline/sparkline-container.directive'

@NgModule({
  imports: [CommonModule],
  declarations: [EasyPieChartContainer, SparklineContainer],
  exports: [EasyPieChartContainer, SparklineContainer],

})
export class InlineGraphsModule{}
