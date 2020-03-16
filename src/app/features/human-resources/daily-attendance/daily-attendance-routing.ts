import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyAttendanceComponent } from './daily-attendance.component';

const routes: Routes = [{
  path: '',
  component: DailyAttendanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAttendanceRoutingModule { }