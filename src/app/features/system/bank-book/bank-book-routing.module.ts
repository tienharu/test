import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankBookMasterComponent } from './bank-book.component';


const routes: Routes = [{
  path: '',
  component: BankBookMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankBookMasterRoutingModule { }
