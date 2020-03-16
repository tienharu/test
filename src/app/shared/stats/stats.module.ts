import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {StatsComponent} from "@app/shared/stats/stats.component";
import {InlineGraphsModule} from "@app/shared/graphs/inline/inline-graphs.module";

@NgModule({
  imports: [CommonModule, InlineGraphsModule],
  declarations: [StatsComponent],
  exports: [StatsComponent],
})
export class StatsModule {}
