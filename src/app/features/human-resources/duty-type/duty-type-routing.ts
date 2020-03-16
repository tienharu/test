import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DutyTypeComponent } from './duty-type.component';

const routes: Routes = [{
  path: '',
  component: DutyTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DutyTypeRoutingModule { }