import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StyleMasterComponent } from './style-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: StyleMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StyleMasterRoutingModule { }
