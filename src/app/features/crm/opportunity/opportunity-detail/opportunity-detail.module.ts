import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpportunityDetailRoutingModule } from './opportunity-detail-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { OpportunityDetailComponent } from './opportunity-detail.component';
import { MomentModule } from 'angular2-moment';
import { OpportunityPopupModule } from '../opportunity-popup/opportunity-popup.module';
import { CommonActivityModule } from '../../common-activity/common-activity.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    OpportunityDetailRoutingModule,
    CommonActivityModule,
    MomentModule,
    OpportunityPopupModule,
  ],
  declarations: [OpportunityDetailComponent]
})
export class OpportunityDetailModule { }
