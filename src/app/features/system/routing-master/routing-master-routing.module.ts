import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingMasterComponent } from './routing-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: RoutingMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingMasterRoutingModule { }
