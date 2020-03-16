import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessFlowMasterComponent } from './process-flow-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: ProcessFlowMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessFlowMasterRoutingModule { }
