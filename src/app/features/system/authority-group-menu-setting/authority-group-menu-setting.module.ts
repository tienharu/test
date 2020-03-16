import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { AuthorityGroupMenuSettingRoutingModule } from '@app/features/system/authority-group-menu-setting/authority-group-menu-setting-routing.module';
import { AuthorityGroupMenuSettingComponent } from '@app/features/system/authority-group-menu-setting/authority-group-menu-setting.component';
import { TreeViewModule } from '@app/shared/ui/tree-view/tree-view.module';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    TreeViewModule,
    TreeModule.forRoot(),
    AuthorityGroupMenuSettingRoutingModule
  ],
  providers: [],
  declarations: [AuthorityGroupMenuSettingComponent]
})
export class AuthorityGroupMenuSettingModule { }
