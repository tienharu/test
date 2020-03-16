import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { GvnReportSummaryExcelRoutingModule } from './summary-excel-routing.module';
import { GvnReportSummaryExcelComponent } from './summary-excel.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GvnReportSummaryExcelRoutingModule
  ],
  declarations: [GvnReportSummaryExcelComponent]
})
export class GvnReportSummaryExcelModule { }
