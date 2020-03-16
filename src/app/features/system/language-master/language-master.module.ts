import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { LanguageMasterRoutingModule } from './language-master-routing.module';
import { LanguageMasterComponent } from './language-master.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    LanguageMasterRoutingModule,  
  ],
  providers: [],
  declarations: [LanguageMasterComponent]
})
export class LanguageMasterModule { }
