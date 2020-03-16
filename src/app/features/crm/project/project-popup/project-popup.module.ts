import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { ProjectPopupComponent } from './project-popup.component';
import { FindOpportunityPopupModule } from '../find-opportunity-popup/find-opportunity-popup.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    FindOpportunityPopupModule
  ],
  exports:[
    ProjectPopupComponent
  ],
  declarations: [ProjectPopupComponent]
})
export class ProjectPopupModule { }
