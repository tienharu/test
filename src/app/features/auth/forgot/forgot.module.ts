import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotRoutingModule } from '@app/features/auth/forgot/forgot-routing.module';
import { ForgotComponent } from '@app/features/auth/forgot/forgot.component';

@NgModule({
  imports: [
    CommonModule,
    ForgotRoutingModule
  ],
  declarations: [ForgotComponent]
})
export class ForgotModule { }
