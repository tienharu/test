import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockedRoutingModule } from '@app/features/auth/locked/locked-routing.module';
import { LockedComponent } from '@app/features/auth/locked/locked.component';

@NgModule({
  imports: [
    CommonModule,
    LockedRoutingModule
  ],
  declarations: [LockedComponent]
})
export class LockedModule { }
