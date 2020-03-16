import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpportunityMasterRoutingModule } from './opportunity-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { CommonSharedModule } from '@app/shared/common/common-shared.module';
import { OpportunityMasterComponent } from './opportunity-master.component';
import { OpportunityPopupModule } from '../opportunity-popup/opportunity-popup.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    OpportunityMasterRoutingModule,
    CommonSharedModule,
    OpportunityPopupModule,
  ],
  declarations: [OpportunityMasterComponent]
})
export class OpportunityMasterModule { }
