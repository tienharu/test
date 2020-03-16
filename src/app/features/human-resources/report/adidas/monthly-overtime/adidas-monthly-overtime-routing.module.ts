import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdidasMonthlyOvertimeComponent } from './adidas-monthly-overtime.component';

const routes: Routes = [{
  path: '',
  component: AdidasMonthlyOvertimeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdidasMonthlyOvertimeRoutingModule { }