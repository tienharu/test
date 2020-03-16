import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { PackageMenuComponent } from '@app/features/system/package-menu/package-menu.component';
import { PackageMenuRoutingModule } from './package-menu-routing.module';
import { TreeViewModule } from '@app/shared/ui/tree-view/tree-view.module';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    PackageMenuRoutingModule,
    TreeViewModule,
    TreeModule.forRoot(),
  ],
  providers: [],
  declarations: [PackageMenuComponent]
})
export class PackageMenuModule { }
