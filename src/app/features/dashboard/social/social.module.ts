import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialRoutingModule } from '@app/features/dashboard/social/social-routing.module';
import { SocialComponent } from '@app/features/dashboard/social/social.component';

@NgModule({
  imports: [
    CommonModule,
    SocialRoutingModule
  ],
  declarations: [SocialComponent]
})
export class SocialModule { }
