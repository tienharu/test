import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestJoinComponent } from '@app/features/auth/request-join/request-join.component';

const routes: Routes = [{
  path: '',
  component: RequestJoinComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestJoinRoutingModule { }
