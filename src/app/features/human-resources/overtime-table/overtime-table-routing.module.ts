import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrOvertimeTableComponent } from './overtime-table.component';

const routes: Routes = [{
  path: '',
  component: HrOvertimeTableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrOvertimeTableRoutingModule { }
