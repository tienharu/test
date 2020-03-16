import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { PackageMasterComponent } from '@app/features/system/package-master/package-master.component';
import { PackageMasterRoutingModule } from './package-master-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    PackageMasterRoutingModule
  ],
  providers: [],
  declarations: [PackageMasterComponent]
})

export class PackageMasterModule { }



