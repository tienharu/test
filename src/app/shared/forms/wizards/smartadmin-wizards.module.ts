import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FuelUxWizardComponent} from "@app/shared/forms/wizards/fuel-ux-wizard.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FuelUxWizardComponent],
  exports: [FuelUxWizardComponent]
})
export class SmartadminWizardsModule { }
