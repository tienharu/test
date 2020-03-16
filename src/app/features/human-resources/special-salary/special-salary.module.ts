import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrSpecialSalaryRoutingModule } from './special-salary-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { HrSpecialSalaryComponent } from './special-salary.component';
import { HrSpecialSalaryDetailComponent } from '../special-salary-detail/special-salary-detail.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomRenderSmartTableSelectComponent, CustomRenderSmartTableSelectzComponent } from '../overtime-table/smart-table-select.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    HrSpecialSalaryRoutingModule,
    Ng2SmartTableModule
  ],
  declarations: [HrSpecialSalaryComponent,HrSpecialSalaryDetailComponent,CustomRenderSmartTableSelectComponent,CustomRenderSmartTableSelectzComponent]
})
export class HrSpecialSalaryModule { }
