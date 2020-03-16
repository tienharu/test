import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ColorpickerDirective} from '@app/shared/forms/input/colorpicker.directive';
import {FileInputComponent} from '@app/shared/forms/input/file-input/file-input.component';
import {KnobDirective} from '@app/shared/forms/input/knob.directive';
import {MaskedInput} from '@app/shared/forms/input/masked-input.directive';
import {UiDatepickerDirective} from '@app/shared/forms/input/ui-datepicker.directive';
import {UiSpinner} from '@app/shared/forms/input/ui-spinner.directive';
import {XEditableComponent} from '@app/shared/forms/input/x-editable.component';
import {DuallistboxComponent} from '@app/shared/forms/input/duallistbox.component';
import {NouisliderDirective} from '@app/shared/forms/input/nouislider.directive'
import {IonSliderDirective} from '@app/shared/forms/input/ionslider.directive'
import {SmartTagsDirective} from '@app/shared/forms/input/smart-tags.directive'
import {SmartTimepickerDirective} from '@app/shared/forms/input/smart-timepicker.directive'
import {SmartClockpickerDirective} from '@app/shared/forms/input/smart-clockpicker.directive'
import {Select2Module} from "@app/shared/forms/input/select2/select2.module";
import {OnOffSwitchModule} from "@app/shared/forms/input/on-off-switch/on-off-switch.module";
import { AutoSelectTextDirective } from './auto-select-text.directive';
import { Select3Module } from './select3/select3.module';
import { SliderModule } from './slider/slider.module';
import { Select4Module } from './select4/select4.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [

    ColorpickerDirective,
    FileInputComponent,
    KnobDirective,
    MaskedInput,
    UiDatepickerDirective,
    UiSpinner,
    XEditableComponent,
    DuallistboxComponent,
    NouisliderDirective,
    IonSliderDirective,
    SmartTagsDirective,
    SmartTimepickerDirective,
    SmartClockpickerDirective,
    AutoSelectTextDirective,
  ],
  exports: [

    ColorpickerDirective,
    FileInputComponent,
    KnobDirective,
    MaskedInput,
    UiDatepickerDirective,
    UiSpinner,
    XEditableComponent,
    DuallistboxComponent,
    NouisliderDirective,
    IonSliderDirective,
    SmartTagsDirective,
    SmartTimepickerDirective,
    SmartClockpickerDirective,
    AutoSelectTextDirective,
    Select2Module,
    Select3Module,
    Select4Module,
    
    OnOffSwitchModule,
    SliderModule
  ]
})
export class SmartadminInputModule { }
