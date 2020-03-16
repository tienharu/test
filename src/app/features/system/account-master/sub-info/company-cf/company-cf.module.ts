import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { CompanyCfComponent } from './company-cf.component';

@NgModule({
  imports: [
    CommonModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
  ],
  exports: [],
  declarations: []
})
export class CompanyCfModule { }
