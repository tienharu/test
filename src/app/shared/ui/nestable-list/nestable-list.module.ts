import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NestableListComponent } from '@app/shared/ui/nestable-list/nestable-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NestableListComponent],
  exports: [NestableListComponent],
})
export class NestableListModule { }
