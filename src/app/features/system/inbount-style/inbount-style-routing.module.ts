import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InbountStyleComponent } from './inbount-style.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: InbountStyleComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InbountStyleRoutingModule { }
