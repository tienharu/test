import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderCreateComponent } from './sales-order-create.component';
import { SalesOrderCreateRoutingModule } from './/sales-order-create-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomRenderSmartTableProcessInputComponent } from './process-input-editor.component';
import { CustomRenderSmartTableProcessSelectComponent } from './process-select-editor.component';
import { CustomRenderSmartTableSaleOrderSelect2Component } from './sale-order-select-editor-2.component';
import { CustomRenderSmartTableProcessCheckboxComponent } from './process-checkbox-editor.component';
import { CustomRenderSmartTableProcessInputDatetimeComponent } from './process-input-datetime.component';
import { CustomRenderSmartTableInputComponent } from './smart-table-input.component';
import { CustomRenderSmartTableProcessInputItemizedComponent } from './process-input-itemized.component';
import { CustomRenderSmartTableProcessInputMPSComponent } from './process-input-mps.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    SalesOrderCreateRoutingModule,
    Ng2SmartTableModule,
    NgxCurrencyModule,
    NgxPaginationModule
  ],
  declarations: [SalesOrderCreateComponent,CustomRenderSmartTableProcessInputMPSComponent,CustomRenderSmartTableProcessInputItemizedComponent,CustomRenderSmartTableInputComponent,CustomRenderSmartTableProcessInputDatetimeComponent,CustomRenderSmartTableProcessInputComponent, CustomRenderSmartTableProcessSelectComponent, CustomRenderSmartTableSaleOrderSelect2Component, CustomRenderSmartTableProcessCheckboxComponent]
})
export class SalesOrderCreateModule { }
