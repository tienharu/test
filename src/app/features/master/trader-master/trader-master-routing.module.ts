import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TraderMasterComponent } from './trader-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: TraderMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraderMasterRoutingModule { }
