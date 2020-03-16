import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasMachineComponent } from './attendance-machine.component';

const routes: Routes = [{
  path: '',
  component: MasMachineComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineRoutingModule { }