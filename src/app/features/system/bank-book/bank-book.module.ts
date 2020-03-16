import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { BankBookMasterRoutingModule } from './bank-book-routing.module';
import { BankBookMasterComponent } from './bank-book.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    Ng2SmartTableModule,
    NgxCurrencyModule,
    BankBookMasterRoutingModule
  ],
  declarations: [BankBookMasterComponent]
})
export class BankBookModule { }
