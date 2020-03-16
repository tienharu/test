import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { GeneralSysMasterComponent } from '@app/features/system/general-sys-master/general-sys-master.component';

const routes: Routes = [{
  path: '',
  component: GeneralSysMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralSysMasterRoutingModule { }
