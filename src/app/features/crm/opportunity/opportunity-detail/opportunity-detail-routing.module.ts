import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityDetailComponent } from './opportunity-detail.component';

const routes: Routes = [{
  path: '',
  component: OpportunityDetailComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityDetailRoutingModule { }
