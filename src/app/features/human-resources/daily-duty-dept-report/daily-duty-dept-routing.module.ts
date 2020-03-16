import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyDutyByDeptComponent } from './daily-duty-dept.component';

const routes: Routes = [{
  path: '',
  component: DailyDutyByDeptComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyDutyByDeptRoutingModule { }