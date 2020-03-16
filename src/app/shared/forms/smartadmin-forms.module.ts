

import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {CommonModule} from "@angular/common";
import {SmartadminInputModule} from "@app/shared/forms/input/smartadmin-input.module";
import {SmartadminValidationModule} from "@app/shared/forms/validation/smartadmin-validation.module";
import {DropzoneModule} from "@app/shared/forms/dropzone/dropzone.module";
import {SmartadminWizardsModule} from "@app/shared/forms/wizards/smartadmin-wizards.module";

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [
  ],
  exports: [

    SmartadminInputModule,

    SmartadminValidationModule,

    DropzoneModule,
    SmartadminWizardsModule,
  ]

})
export class SmartadminFormsModule{}
