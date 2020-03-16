import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SmartadminValidationModule } from '@app/shared/forms/validation/smartadmin-validation.module';
import { SmartadminInputModule } from '@app/shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '@app/shared/ui/datatable/smartadmin-datatable.module';
import { RocketChatComponent } from '@app/features/system/rocket-chat/rocket-chat.component';
import { RocketChatRoutingModule } from './rocket-chat-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SmartadminValidationModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    RocketChatRoutingModule
  ],
  providers: [],
  declarations: [RocketChatComponent]
})

export class RocketChatModule { }



