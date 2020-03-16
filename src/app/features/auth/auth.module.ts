import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {routing} from "@app/features/auth/auth.routing";
import { AuthComponent } from '@app/features/auth/auth.component';

@NgModule({
  imports: [
    CommonModule,

    routing,
  ],
  declarations: [ AuthComponent]
})
export class AuthModule { }
