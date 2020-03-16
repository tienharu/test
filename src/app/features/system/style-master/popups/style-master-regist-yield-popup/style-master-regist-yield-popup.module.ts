import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { StyleMasterRegistYieldPopupComponent } from './style-master-regist-yield-popup.component';
import { FindOpportunityPopupModule } from '@app/features/crm/project/find-opportunity-popup/find-opportunity-popup.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CustomRenderSmartTableStyleSelect2Component } from '../../common/select2-editor.component';
import { NgxCurrencyModule } from 'ngx-currency';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    FindOpportunityPopupModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
  ],
  exports:[
    StyleMasterRegistYieldPopupComponent
  ],
  declarations: [StyleMasterRegistYieldPopupComponent]
})
export class StyleMasterRegistYieldPopupModule { }
