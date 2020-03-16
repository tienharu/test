import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasingMagtComponent } from './purchasing-magt.component';
import { CustomPurchasingInputEditorComponent } from './common/purchasing-input-editor.component';
import { CustomPurchasingSelectEditorComponent } from './common/purchasing-select-editor.comonent';
import { CustomPurchasingInputCurrencyEditorComponent } from './common/purchasing-input-currency-editor.component';

import { PurchasingRoutingModule } from './purchasing-magt-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { SearchPoSheetPopupModule } from './po-sheet-search-popup/search-po-sheet-popup.module';
import { PurchasingSearchPopupModule } from './purchasing-search-popup/purchasing-search-popup.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
    PurchasingRoutingModule,
    SearchPoSheetPopupModule,
    PurchasingSearchPopupModule,
  ],
  declarations: [
    PurchasingMagtComponent,
    CustomPurchasingInputEditorComponent,
    CustomPurchasingSelectEditorComponent,
    CustomPurchasingInputCurrencyEditorComponent
  ]
})
export class PurchasingModule {}
