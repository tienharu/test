import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InbountStyleComponent } from './inbount-style.component';
import { InbountStyleRoutingModule } from './inbount-style-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { WorkOrderNoPopupModule } from '../work-order-no-popup/work-order-no-popup.module';
import { CustomInboundStyleTextareaEditorComponent } from './common/inbound-style-textarea-editor.component';
import { CustomInboundStyleDisabledEditorComponent } from './common/inbound-style-input-disabled-editor.component';
import { CustomInboundStyleEditorComponent } from './common/inbound-style-input-editor.component';
import { CustomRenderSmartTableSelect2InboundStyleComponent } from './common/select2-inbound-style-editor.component';
import { InboundStyleHeaderPopupModule } from './inbound-style-header-popup/inbound-style-header-popup.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
    InbountStyleRoutingModule,
    WorkOrderNoPopupModule,
    InboundStyleHeaderPopupModule
  ],
  declarations: [
    InbountStyleComponent,
    CustomInboundStyleTextareaEditorComponent,
    CustomInboundStyleDisabledEditorComponent,
    CustomInboundStyleEditorComponent,
    CustomRenderSmartTableSelect2InboundStyleComponent
  ]
})
export class InbountStyleModule {}
