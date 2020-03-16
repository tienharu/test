import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleMasterComponent } from './style-master.component';
import { RowMaterialComponent } from './tabs/row-material/row-material.component';
import { SubMaterialComponent } from './tabs/sub-material/sub-material.component';
import { PoMaterialComponent } from './tabs/po/po-material.component';
import { CustomRenderSmartTableStyleInputCheckboxComponent } from './common/input-checkbox-editor.component';
import { CustomRenderSmartTableStyleInputCurrencyComponent } from './common/input-currency-editor.component';
import { CustomRenderSmartTableStyleInputFloatComponent } from './common/input-float-editor.component';
import { CustomRenderSmartTableStyleInputDateComponent } from './common/input-date-editor.component';
import { CustomRenderSmartTableStyleInputComponent } from './common/input-editor.component';
import { CustomRenderSmartTableStyleSelect2Component } from './common/select2-editor.component';
import { StyleMasterRoutingModule } from './style-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { RowMaterialModule } from './tabs/row-material/row-material.module';
import { SubMaterialModule } from './tabs/sub-material/sub-material.module';
import { StyleMasterBreakDownPopupModule } from './popups/style-master-breakdown-popup/style-master-breakdown-popup.module';
import { StyleMasterRegistColorPopupModule } from './popups/style-master-regist-color-popup/style-master-regist-color-popup.module';
import { StyleMasterRegistSwatchPopupModule } from './popups/style-master-regist-swatch-popup/style-master-regist-swatch-popup.module';
import { StyleMasterRegistYieldPopupModule } from './popups/style-master-regist-yield-popup/style-master-regist-yield-popup.module';
import { StyleMasterSearchPopupModule } from './popups/style-master-search-popup/style-master-search-popup.module';

import { POMaterialModule } from './tabs/po/po-material.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BreakdownClickComponent } from './tabs/po/breakdown-click/breakdown-click.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
    StyleMasterRoutingModule,
    RowMaterialModule,
    SubMaterialModule,
    POMaterialModule,
    StyleMasterBreakDownPopupModule,
    StyleMasterRegistColorPopupModule,
    StyleMasterRegistSwatchPopupModule,
    StyleMasterRegistYieldPopupModule,
    StyleMasterSearchPopupModule
  ],
  declarations: [
    StyleMasterComponent,
    RowMaterialComponent,
    SubMaterialComponent,
    PoMaterialComponent,
    CustomRenderSmartTableStyleInputComponent,
    CustomRenderSmartTableStyleSelect2Component,
    CustomRenderSmartTableStyleInputCurrencyComponent,
    CustomRenderSmartTableStyleInputDateComponent,
    CustomRenderSmartTableStyleInputCheckboxComponent,
    CustomRenderSmartTableStyleInputFloatComponent,
    BreakdownClickComponent
  ]
})
export class StyleMasterModule { }
