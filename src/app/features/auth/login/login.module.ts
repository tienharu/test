import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoginRoutingModule } from '@app/features/auth/login/login-routing.module';
import { LoginComponent } from '@app/features/auth/login/login.component';
import { SmartadminValidationModule } from "@app/shared/forms/validation/smartadmin-validation.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    SmartadminValidationModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
