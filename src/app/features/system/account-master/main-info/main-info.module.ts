import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { MainInfoRoutingModule } from './main-info-routing.module';
import { MainInfoComponent } from './main-info.component';
import { GlobalAcComponent } from '../sub-info/global-ac/global-ac.component';
import { CompanyAcComponent } from '../sub-info/company-ac/company-ac.component';
import { CompanyCfComponent } from '../sub-info/company-cf/company-cf.component';
import { LocalLanguageSettingComponent } from '../sub-info/local-language-setting/local-language-setting.component';
import { CompanyAcModule } from '../sub-info/company-ac/company-ac.module';
import { CompanyCfModule } from '../sub-info/company-cf/company-cf.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    MainInfoRoutingModule,
    CompanyAcModule,
    CompanyCfModule
  ],
    declarations: [ MainInfoComponent,GlobalAcComponent, CompanyAcComponent,CompanyCfComponent,LocalLanguageSettingComponent]
})
export class MainInfoModule { }
