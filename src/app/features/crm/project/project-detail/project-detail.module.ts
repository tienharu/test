import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectDetailRoutingModule } from './project-detail-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { CommonActivityModule } from '../../common-activity/common-activity.module';
import { ProjectPopupModule } from '../project-popup/project-popup.module';
import { ProjectDetailComponent } from './project-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    CommonActivityModule,
    ProjectDetailRoutingModule,
    ProjectPopupModule
  ],
  declarations: [ProjectDetailComponent]
})
export class ProjectDetailModule { }
