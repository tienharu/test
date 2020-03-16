import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BomMasterComponent } from './bom-master.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: BomMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BomMasterRoutingModule { }
