import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { PackageMasterComponent } from './package-master.component';

const routes: Routes = [{
  path: '',
  component: PackageMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageMasterRoutingModule { }
