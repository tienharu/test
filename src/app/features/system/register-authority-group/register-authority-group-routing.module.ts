import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterAuthorityGroupComponent } from '@app/features/system/register-authority-group/register-authority-group.component';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

const routes: Routes = [{
  path: '',
  component: RegisterAuthorityGroupComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterAuthorityGroupRoutingModule { }
