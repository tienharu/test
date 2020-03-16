import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { ServiceItemComponent } from './service-item.component';
import { ServiceItemRoutingModule } from './service-item-routing.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,

    NgxCurrencyModule,
    ServiceItemRoutingModule
  ],
  declarations: [
    ServiceItemComponent
  ]
})
export class ServiceItemModule { }
