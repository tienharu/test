import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StyleMasterListComponent } from './style-master-list.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: StyleMasterListComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StyleMasterListRoutingModule { }
