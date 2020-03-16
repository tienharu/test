import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select3Directive } from './select3.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Select3Directive],
  exports: [Select3Directive],
})
export class Select3Module { }
