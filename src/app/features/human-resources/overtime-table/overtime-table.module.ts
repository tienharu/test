import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrOvertimeTableRoutingModule } from './overtime-table-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { HrOvertimeTableComponent } from './overtime-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableDatepickerComponent, SmartTableDatepickerRenderComponent } from './smart-table-datepicker.component';
import { CustomRenderSmartTableInputComponent } from './smart-table-input.component';
import { OvertimeTableCreateComponent } from './overtime-table-create.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    HrOvertimeTableRoutingModule,
    Ng2SmartTableModule
  ],
  declarations: [HrOvertimeTableComponent,SmartTableDatepickerComponent,SmartTableDatepickerRenderComponent,CustomRenderSmartTableInputComponent,OvertimeTableCreateComponent]
})
export class HrOvertimeTableModule { }
