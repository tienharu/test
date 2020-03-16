import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WipMasterComponent } from './wip-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: WipMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WipMasterRoutingModule { }
