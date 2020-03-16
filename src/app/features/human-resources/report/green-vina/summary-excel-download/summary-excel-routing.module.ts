import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvnReportSummaryExcelComponent } from './summary-excel.component';

const routes: Routes = [{
  path: '',
  component: GvnReportSummaryExcelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GvnReportSummaryExcelRoutingModule { }
