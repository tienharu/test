import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorityGroupMenuSettingComponent } from '@app/features/system/authority-group-menu-setting/authority-group-menu-setting.component';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

const routes: Routes = [{
  path: '',
  component: AuthorityGroupMenuSettingComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorityGroupMenuSettingRoutingModule { }
