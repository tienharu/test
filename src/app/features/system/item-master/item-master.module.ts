import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemMasterComponent } from './item-master.component';
import { ItemMasterRoutingModule } from './item-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    ItemMasterRoutingModule,NgxCurrencyModule
  ],
  declarations: [ItemMasterComponent]
})
export class ItemMasterModule { }
