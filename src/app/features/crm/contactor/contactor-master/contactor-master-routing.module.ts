import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactorMasterComponent } from './contactor-master.component';

const routes: Routes = [{
  path: '',
  component: ContactorMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactorMasterRoutingModule { }