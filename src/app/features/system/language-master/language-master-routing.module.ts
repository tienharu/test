import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { LanguageMasterComponent } from './language-master.component';

const routes: Routes = [
  {
    path: '',
    component: LanguageMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageMasterRoutingModule { }
