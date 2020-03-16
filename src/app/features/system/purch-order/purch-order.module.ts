import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchOrderComponent } from './purch-order.component';
import { PurchOrderRoutingModule } from './purch-order-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { CustomRenderSmartTableStyleSelect2PurchOrderComponent } from './common/select2-supplier-editor.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { WorkOrderNoPopupModule } from '../work-order-no-popup/work-order-no-popup.module';
import { CustomPurchInputEditorComponent } from './common/purch-input-editor.component';
import { CustomPurchTextareaEditorComponent } from './common/purch-textarea-editor.component';
import { PurchOrderPopupModule } from './purch-order-popup/purch-order-popup.module';
import { CustomPurchInputDisabledEditorComponent } from './common/purch-input-disabled-editor.component';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    PurchOrderRoutingModule,
    Ng2SmartTableModule,
    WorkOrderNoPopupModule,
    PurchOrderPopupModule,
    NgxCurrencyModule
  ],
  declarations: [
    PurchOrderComponent,
    CustomRenderSmartTableStyleSelect2PurchOrderComponent,
    CustomPurchInputEditorComponent,
    CustomPurchTextareaEditorComponent,
    CustomPurchInputDisabledEditorComponent
  ]
})
export class PurchOrderModule { }
