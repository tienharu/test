import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select4Directive } from './select4.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Select4Directive],
  exports: [Select4Directive],
})
export class Select4Module { }
