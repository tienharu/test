import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionCodeBoxComponent } from './transaction-code-box.component';


const routes: Routes = [{
  path: '',
  component: TransactionCodeBoxComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionCodeBoxRoutingModule { }
