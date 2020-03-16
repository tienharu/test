import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyOvertimeComponent } from './monthly-overtime.component';

const routes: Routes = [{
  path: '',
  component: MonthlyOvertimeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyOvertimeRoutingModule { }