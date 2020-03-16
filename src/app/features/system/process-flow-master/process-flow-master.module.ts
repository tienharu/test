import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessFlowMasterComponent } from './process-flow-master.component';
import { ProcessFlowMasterRoutingModule } from './/process-flow-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomRenderSmartTableProcessInputComponent } from './process-input-editor.component';
import { CustomRenderSmartTableProcessSelectComponent } from './process-select-editor.component';
import { CustomRenderSmartTableProcessSelect2Component } from './process-select2-editor.component';
import { CustomRenderSmartTableProcessCheckboxComponent } from './process-checkbox-editor.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemizedPopupModule } from '../../../shared/common/Itemized-popup/itemized-popup.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    ProcessFlowMasterRoutingModule,
    Ng2SmartTableModule,
    NgxCurrencyModule,
    NgxPaginationModule,
    ItemizedPopupModule
  ],
  declarations: [ProcessFlowMasterComponent, CustomRenderSmartTableProcessInputComponent, CustomRenderSmartTableProcessSelectComponent, CustomRenderSmartTableProcessSelect2Component, CustomRenderSmartTableProcessCheckboxComponent]
})
export class ProcessFlowMasterModule { }
