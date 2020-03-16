import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/services';
import { PayrollClosingComponent } from './payroll-closing.component';

const routes: Routes = [{
  path: '',
  component: PayrollClosingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollClosingRoutingModule { }
