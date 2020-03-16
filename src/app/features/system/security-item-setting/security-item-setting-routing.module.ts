import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { SecurityItemSettingComponent } from './security-item-setting.component';

const routes: Routes = [{
  path: '',
  component: SecurityItemSettingComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityItemSettingRoutingModule { }
