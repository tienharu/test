import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkCalendarComponent } from './work-calendar.component';

const routes: Routes = [{
  path: '',
  component: WorkCalendarComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCalendarRoutingModule { }
