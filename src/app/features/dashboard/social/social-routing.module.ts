import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SocialComponent} from "@app/features/dashboard/social/social.component";
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

const routes: Routes = [{
  path: '',
  component: SocialComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SocialRoutingModule { }
