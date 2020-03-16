import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendancePersonComponent } from './attendance-person.component';

const routes: Routes = [{
  path: '',
  component: AttendancePersonComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancePersonRoutingModule { }