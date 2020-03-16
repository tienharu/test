import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SalesOrderBoardComponent } from './sales-order-board.component';
import { CanDeactivateGuard } from '@app/core/services';

const routes: Routes = [{
  path: '',
  component: SalesOrderBoardComponent,
  canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderBoardRoutingModule { }
