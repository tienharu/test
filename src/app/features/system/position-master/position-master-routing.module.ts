import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { PositionMasterComponent } from '@app/features/system/position-master/position-master.component';

const routes: Routes = [{
  path: '',
  component: PositionMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionMasterRoutingModule { }
