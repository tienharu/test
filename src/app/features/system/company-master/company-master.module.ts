import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { companyRouting } from '@app/features/system/company-master/company-master-routing.module';
import { CompanyMasterComponent } from '@app/features/system/company-master/company-master.component';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { CompanyContractComponent } from './company-contract.component';
import { EditContractComponent } from './edit-contract.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    companyRouting,
  ],
  providers: [],
  declarations: [CompanyMasterComponent,CompanyContractComponent,EditContractComponent]
})
export class CompanyMasterModule { }
