import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from '@app/shared/ui/tree-view/tree-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TreeViewComponent],
  exports: [TreeViewComponent]
})
export class TreeViewModule { }
