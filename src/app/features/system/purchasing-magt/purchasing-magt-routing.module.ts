import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchasingMagtComponent } from './purchasing-magt.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: PurchasingMagtComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasingRoutingModule { }
