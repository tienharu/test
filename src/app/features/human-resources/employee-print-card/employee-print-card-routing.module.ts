import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePrintCardComponent } from './employee-print-card.component';

const routes: Routes = [{
  path: '',
  component: EmployeePrintCardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeePrintCardRoutingModule { }
