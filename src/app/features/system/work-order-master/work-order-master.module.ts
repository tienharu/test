import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderMasterComponent } from './work-order-master.component';
import { CustomRenderSmartTableWorkOrderInputCheckboxComponent } from './common/input-checkbox-editor.component';
import { CustomRenderSmartTableWorkOrderInputCurrencyComponent } from './common/input-currency-editor.component';
import { CustomRenderSmartTableWorkOrderInputFloatComponent } from './common/input-float-editor.component';
import { CustomRenderSmartTableWorkOrderInputDateComponent } from './common/input-date-editor.component';
import { CustomRenderSmartTableWorkOrderInputComponent } from './common/input-editor.component';
import { CustomRenderSmartTableWorkOrderSelect2Component } from './common/select2-editor.component';
import { WorkOrderMasterRoutingModule } from './work-order-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { WorkOrderRowMaterialModule } from './tabs/work-order-row-material/work-order-row-material.module';
import { WorkOrderSubMaterialModule } from './tabs/work-order-sub-material/work-order-sub-material.module';
import { WorkTypeModule } from './tabs/work-type/work-type.module';
import { WorkOrderImageModule } from './tabs/work-order-image/work-order-image.module';
import { SearchStyleMasterPopupModule } from './popups/search-style-master-popup/search-style-master-popup.module';
import { SearchWorkOrderMasterPopupModule } from './popups/search-work-order-master-popup/search-work-order-master-popup.module';
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
    WorkOrderMasterRoutingModule,
    WorkOrderRowMaterialModule,
    WorkOrderSubMaterialModule,
    WorkTypeModule,
    WorkOrderImageModule,
    SearchStyleMasterPopupModule,
    SearchWorkOrderMasterPopupModule
  ],
  declarations: [
    WorkOrderMasterComponent,
    CustomRenderSmartTableWorkOrderInputComponent,
    CustomRenderSmartTableWorkOrderSelect2Component,
    CustomRenderSmartTableWorkOrderInputCurrencyComponent,
    CustomRenderSmartTableWorkOrderInputDateComponent,
    CustomRenderSmartTableWorkOrderInputCheckboxComponent,
    CustomRenderSmartTableWorkOrderInputFloatComponent
  ]
})
export class WorkOrderMasterModule {}
