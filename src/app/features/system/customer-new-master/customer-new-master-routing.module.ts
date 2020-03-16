import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/services';
import { CustomerNewMasterComponent } from './customer-new-master.component';

const routes: Routes = [{
  path: '',
  component: CustomerNewMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerNewMasterRoutingModule { }
