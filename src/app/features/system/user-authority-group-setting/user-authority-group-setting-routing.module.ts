import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthorityGroupSettingComponent } from '@app/features/system/user-authority-group-setting/user-authority-group-setting.component';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

const routes: Routes = [{
  path: '',
  component: UserAuthorityGroupSettingComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAuthorityGroupSettingRoutingModule { }
