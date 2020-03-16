import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LockedComponent} from "@app/features/auth/locked/locked.component";

const routes: Routes = [{
  path: '',
  component: LockedComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LockedRoutingModule { }
