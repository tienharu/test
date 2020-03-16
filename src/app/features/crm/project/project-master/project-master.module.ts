import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectMasterRoutingModule } from './project-master-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { CommonSharedModule } from '@app/shared/common/common-shared.module';
import { ProjectPopupModule } from '../project-popup/project-popup.module';
import { ProjectMasterComponent } from './project-master.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    ProjectMasterRoutingModule,
    CommonSharedModule,
    ProjectPopupModule,
  ],
  declarations: [ProjectMasterComponent]
})
export class ProjectMasterModule { }
