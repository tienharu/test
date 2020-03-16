import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartSliderDirective } from './smart-slider.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SmartSliderDirective],
  exports: [SmartSliderDirective],
})
export class SliderModule { }
