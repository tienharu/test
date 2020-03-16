import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemMenuComponent } from '@app/features/system/system-menu/system-menu.component';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

const routes: Routes = [{
  path: '',
  component: SystemMenuComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemMenuRoutingModule { }
