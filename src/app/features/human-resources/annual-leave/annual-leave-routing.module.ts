import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnualLeaveComponent } from './annual-leave.component';


const routes: Routes = [{
  path: '',
  component: AnnualLeaveComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnualLeaveRoutingModule { }
