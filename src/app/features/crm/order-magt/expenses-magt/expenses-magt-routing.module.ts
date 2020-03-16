import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesMagtComponent } from './expenses-magt.component';

const routes: Routes = [{
  path: '',
  component: ExpensesMagtComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesMagtRoutingModule { }
