import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollItemComponent } from './payroll-item.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: PayrollItemComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollItemRoutingModule { }
