import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrSpecialSalaryComponent } from './special-salary.component';

const routes: Routes = [{
  path: '',
  component: HrSpecialSalaryComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrSpecialSalaryRoutingModule { }
