import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesDueOutComponent } from './sales-due-out.component';
import { SalesDueOutRoutingModule } from './sales-due-out-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SearchWorkOrderMasterPopupModule } from '../work-order-master/popups/search-work-order-master-popup/search-work-order-master-popup.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
    SalesDueOutRoutingModule,
    SearchWorkOrderMasterPopupModule
  ],
  declarations: [
    SalesDueOutComponent
  ]
})
export class SalesDueOutModule {}
