import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialMasterComponent } from './material-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: MaterialMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialMasterRoutingModule { }
