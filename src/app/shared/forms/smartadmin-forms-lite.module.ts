import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {CommonModule} from "@angular/common";
import {Select2Module} from "@app/shared/forms/input/select2/select2.module";
import {OnOffSwitchModule} from "@app/shared/forms/input/on-off-switch/on-off-switch.module";

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [
  ],
  exports: [
    Select2Module, OnOffSwitchModule
  ]

})
export class SmartadminFormsLiteModule{}
