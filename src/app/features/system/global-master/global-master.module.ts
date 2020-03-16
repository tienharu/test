import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalMasterComponent } from './global-master.component';
import { GlobalMasterRoutingModule } from './/global-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    GlobalMasterRoutingModule
  ],
  declarations: [GlobalMasterComponent]
})
export class GlobalMasterModule { }
