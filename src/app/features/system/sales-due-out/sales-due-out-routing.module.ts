import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesDueOutComponent } from './sales-due-out.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: SalesDueOutComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesDueOutRoutingModule { }
