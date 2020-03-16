import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostingAttendanceListComponent } from './posting-attendance-list.component';



const routes: Routes = [{
  path: '',
  component: PostingAttendanceListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostingAttendanceListRoutingModule { }
