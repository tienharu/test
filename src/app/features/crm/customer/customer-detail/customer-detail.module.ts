import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDetailRoutingModule } from './customer-detail-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { CustomerDetailComponent } from './customer-detail.component';
import { CustomerEditModule } from '../customer-edit/customer-edit.module';
import { CommonActivityModule } from '../../common-activity/common-activity.module';
import { MomentModule } from 'angular2-moment';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    CustomerDetailRoutingModule,
    CustomerEditModule,
    CommonActivityModule,
    MomentModule,
    TooltipModule

  ],
  declarations: [CustomerDetailComponent]
})
export class CustomerDetailModule { }
