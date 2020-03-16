import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShiftworkRegisterComponent } from './shiftwork-register.component';

const routes: Routes = [{
  path: '',
  component: ShiftworkRegisterComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftworkRegisterRoutingModule { }
