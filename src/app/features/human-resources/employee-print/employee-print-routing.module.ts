import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePrintComponent } from './employee-print.component';

const routes: Routes = [{
  path: '',
  component: EmployeePrintComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HREmployeePrintRoutingModule { }