import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { TransactionCodeBoxRoutingModule } from './transaction-code-box-routing.module';
import { TransactionCodeBoxComponent } from './transaction-code-box.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomRenderSmartTableTransactionSelect2Component } from './transaction-select-editor.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    Ng2SmartTableModule,
    NgxCurrencyModule,
    TransactionCodeBoxRoutingModule
  ],
  declarations: [TransactionCodeBoxComponent,CustomRenderSmartTableTransactionSelect2Component]
})
export class TransactionCodeBoxModule { }
