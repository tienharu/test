import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityPopupComponent } from './opportunity-popup.component';
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
    OpportunityPopupComponent
  ],
  declarations: [OpportunityPopupComponent]
})
export class OpportunityPopupModule { }
