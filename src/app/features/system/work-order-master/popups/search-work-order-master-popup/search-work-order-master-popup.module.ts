import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SearchWorkOrderMasterPopupComponent } from './search-work-order-master-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
  ],
  exports:[
    SearchWorkOrderMasterPopupComponent
  ],
  declarations: [SearchWorkOrderMasterPopupComponent]
})
export class SearchWorkOrderMasterPopupModule { }
