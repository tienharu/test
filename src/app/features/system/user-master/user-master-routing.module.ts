import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { UserMasterComponent } from '@app/features/system/user-master/user-master.component';

const routes: Routes = [{
  path: '',
  component: UserMasterComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMasterRoutingModule { }
