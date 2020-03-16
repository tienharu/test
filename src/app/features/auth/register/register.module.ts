import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from '@app/features/auth/register/register-routing.module';
import { RegisterComponent } from '@app/features/auth/register/register.component';
import { TermsModalComponent } from '@app/features/auth/register/terms-modal/terms-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,

    ReactiveFormsModule,
  ],
  exports: [],
  declarations: [RegisterComponent, TermsModalComponent]
})
export class RegisterModule { }
