import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { WorkOrderSubMaterialComponent } from './work-order-sub-material.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    Ng2SmartTableModule
  ],
  exports: [WorkOrderSubMaterialComponent],
  declarations: [WorkOrderSubMaterialComponent]
})
export class WorkOrderSubMaterialModule { }
