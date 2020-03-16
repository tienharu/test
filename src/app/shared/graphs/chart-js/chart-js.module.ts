import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartJsComponent } from '@app/shared/graphs/chart-js/chart-js.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ChartJsComponent],
  exports: [ChartJsComponent],
})
export class ChartJsModule { }
