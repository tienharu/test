import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { GeneralMasterComponent } from '@app/features/system/general-master/general-master.component';

const routes: Routes = [{
  path: '',
  component: GeneralMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralMasterRoutingModule { }
