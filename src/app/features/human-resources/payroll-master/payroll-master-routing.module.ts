import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollMasterComponent } from './payroll-master.component';

const routes: Routes = [{
  path: '',
  component: PayrollMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollMasterRoutingModule { }