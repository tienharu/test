import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HRMainInfoComponent } from './main-info.component';

const routes: Routes = [{
  path: '',
  component: HRMainInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRMainInfoRoutingModule { }
