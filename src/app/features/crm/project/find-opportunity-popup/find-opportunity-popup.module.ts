import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindOpportunityPopupComponent } from './find-opportunity-popup.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule
  ],
  exports:[
    FindOpportunityPopupComponent
  ],
  declarations: [FindOpportunityPopupComponent]
})
export class FindOpportunityPopupModule { }
