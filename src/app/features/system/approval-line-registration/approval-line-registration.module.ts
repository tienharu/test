import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalLineRegComponent} from './approval-line-registration.component';
import { ApprovalLineRegistrationRoutingModule } from './approval-line-registration-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { NgxCurrencyModule } from "ngx-currency";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ApprovalLineRegiatrationComponent } from './approval-popup-infor/approval-popup-infor.component';
import { ApprovalLineRegistrationPopupModule } from '../approval-line-registration-popup/approval-line-registration-popup.module';
import { CustomProcessComponent } from './process.component';
import { CustomTypeComponent } from './type.component';
import { ApprovalLineRegiatrationSubComponent } from './approval-popup-infor-sub/approval-popup-infor-sub.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    NgxCurrencyModule,
    Ng2SmartTableModule,
    ApprovalLineRegistrationRoutingModule,
    ApprovalLineRegistrationPopupModule,
  ],
  
  declarations: [ApprovalLineRegComponent,ApprovalLineRegiatrationComponent,CustomProcessComponent,CustomTypeComponent,ApprovalLineRegiatrationSubComponent]
})
export class ApprovalLineRegistrationModule { }
