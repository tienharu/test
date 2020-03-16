import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyDutyComponent } from './monthly-duty.component';

const routes: Routes = [{
  path: '',
  component: MonthlyDutyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyDutyRoutingModule { }