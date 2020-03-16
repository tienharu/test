import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DueOutMaterialComponent } from './due-out-material.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: DueOutMaterialComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DueOutMaterialRoutingModule { }
