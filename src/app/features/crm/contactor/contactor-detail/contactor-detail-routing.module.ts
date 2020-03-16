import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactorDetailComponent } from './contactor-detail.component';

const routes: Routes = [{
  path: '',
  component: ContactorDetailComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactorDetailRoutingModule { }
