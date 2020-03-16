import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GvnMonthlyAttendanceComponent } from './gvn-monthly-attendance.component';

const routes: Routes = [{
  path: '',
  component: GvnMonthlyAttendanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GvnMonthlyAttendanceRoutingModule { }
