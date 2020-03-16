import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdidasMonthlyTurnoverComponent } from './adidas-monthly-turnover.component';

const routes: Routes = [{
  path: '',
  component: AdidasMonthlyTurnoverComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdidasMonthlyTurnoverRoutingModule { }