import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { ContactorDetailComponent } from './contactor-detail.component';
import { CommonActivityModule } from '../../common-activity/common-activity.module';
import { ContactorDetailRoutingModule } from './contactor-detail-routing.module';
import { ContactorEditModule } from '../contactor-edit/contactor-edit.module';
import { MomentModule } from 'angular2-moment';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    ContactorDetailRoutingModule,
    CommonActivityModule,
    ContactorEditModule,
    MomentModule,
    TooltipModule
  ],
  declarations: [ContactorDetailComponent]
})
export class ContactorDetailModule { }
