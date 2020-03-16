import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonthlyAttendanceComponent } from './monthly-attendance.component';

const routes: Routes = [{
  path: '',
  component: MonthlyAttendanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyAttendanceRoutingModule { }