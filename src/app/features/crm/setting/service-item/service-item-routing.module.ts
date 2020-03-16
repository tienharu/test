import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceItemComponent } from './service-item.component';

const routes: Routes = [{
  path: '',
  component: ServiceItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceItemRoutingModule { }
