import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityMasterComponent } from './opportunity-master.component';

const routes: Routes = [{
  path: '',
  component: OpportunityMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityMasterRoutingModule { }
