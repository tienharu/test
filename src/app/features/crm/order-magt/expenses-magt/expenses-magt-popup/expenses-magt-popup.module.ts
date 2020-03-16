import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { ExpensesPopupComponent } from './expenses-magt-popup.component';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    NgxCurrencyModule,

  ],
  exports:[
    ExpensesPopupComponent
  ],
  declarations: [ExpensesPopupComponent]
})
export class ExpensesMagtPopupModule { }
