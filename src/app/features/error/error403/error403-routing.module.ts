import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error403Component } from '@app/features/error/error403/error403.component';

const routes: Routes = [{
  path: '',
  component: Error403Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class Error403RoutingModule { }
