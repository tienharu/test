import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupSharingSettingComponent } from './group-sharing-setting.component';

const routes: Routes = [
  {
    path: '',
    component: GroupSharingSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupSharingSettingRoutingModule { }
