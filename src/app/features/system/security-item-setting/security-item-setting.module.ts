import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { SecurityItemSettingComponent } from './security-item-setting.component';
import { SecurityItemSettingRoutingModule } from './security-item-setting-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharingTypeComponent } from './sharing-type/sharing-type.component';
import { OpenTypeComponent } from './open-type/open-type.component';
import { UseynComponent } from './useyn/useyn.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    SecurityItemSettingRoutingModule,
    Ng2SmartTableModule
  ],
  providers: [],
  declarations: [
    SecurityItemSettingComponent,
    SharingTypeComponent,
    OpenTypeComponent,
    UseynComponent
  ],
  entryComponents:[SharingTypeComponent,OpenTypeComponent,UseynComponent],
})
export class SecurityItemSettingModule { }
