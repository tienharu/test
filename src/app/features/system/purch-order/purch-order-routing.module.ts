import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchOrderComponent } from './purch-order.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: PurchOrderComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchOrderRoutingModule { }
