import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestJoinRoutingModule } from './request-join-routing.module';
import { FormsModule } from '@angular/forms';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { RequestJoinComponent } from '@app/features/auth/request-join/request-join.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RequestJoinRoutingModule,
    SmartadminValidationModule
  ],
  declarations: [RequestJoinComponent]
})
export class RequestJoinModule { }
