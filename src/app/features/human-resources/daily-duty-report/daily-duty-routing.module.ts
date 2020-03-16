import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyDutyComponent } from './daily-duty.component';

const routes: Routes = [{
  path: '',
  component: DailyDutyComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyDutyRoutingModule { }