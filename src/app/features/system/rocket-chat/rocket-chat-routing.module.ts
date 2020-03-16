import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { RocketChatComponent } from './rocket-chat.component';

const routes: Routes = [{
  path: '',
  component: RocketChatComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RocketChatRoutingModule { }
