import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { FindOpportunityPopupModule } from '@app/features/crm/project/find-opportunity-popup/find-opportunity-popup.module';
import { WorkOrderNoPopupComponent } from './work-order-no-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    FindOpportunityPopupModule,
    SmartadminDatatableModule,
  ],
  exports:[
    WorkOrderNoPopupComponent
  ],
  declarations: [WorkOrderNoPopupComponent]
})
export class WorkOrderNoPopupModule { }
