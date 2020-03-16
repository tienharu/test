import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMasterComponent } from './material-master.component';
import { MaterialMasterRoutingModule } from './/material-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { MaterialMasterPopupModule } from '../material-master-popup/material-master-popup.module';
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    MaterialMasterRoutingModule,
    MaterialMasterPopupModule,
    NgxCurrencyModule
  ],
  declarations: [MaterialMasterComponent]
})
export class MaterialMasterModule { }
