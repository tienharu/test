import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';

import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ExpensesMagtComponent } from './expenses-magt.component';
import { ExpensesMagtRoutingModule } from './expenses-magt-routing.module';
import { ExpensesMagtPopupModule } from './expenses-magt-popup/expenses-magt-popup.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    ExpensesMagtRoutingModule,
    ExpensesMagtPopupModule,

  ],
  declarations: [
    ExpensesMagtComponent
  ]
})
export class ExpensesMagtModule { }
