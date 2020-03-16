import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationMasterComponent } from '@app/features/system/organization-master/organization-master.component';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

const routes: Routes = [{
  path: '',
  component: OrganizationMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationMasterRoutingModule { }
