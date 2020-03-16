import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SmartadminLayoutModule } from "@app/shared/layout";

import { I18nModule } from "@app/shared/i18n/i18n.module";
import { UserModule } from "@app/shared/user/user.module";
import { BootstrapModule } from "@app/shared/bootstrap.module";
import { VoiceControlModule } from "@app/shared/voice-control/voice-control.module";

import { SmartadminWidgetsModule } from "@app/shared/widgets/smartadmin-widgets.module";

import { UtilsModule } from "@app/shared/utils/utils.module";
import { PipesModule } from "@app/shared/pipes/pipes.module";
import { ChatModule } from "@app/shared/chat/chat.module";
import { StatsModule } from "@app/shared/stats/stats.module";
import { InlineGraphsModule } from "@app/shared/graphs/inline/inline-graphs.module";
import { SmartadminFormsLiteModule } from "@app/shared/forms/smartadmin-forms-lite.module";
import { SmartProgressbarModule } from "@app/shared/ui/smart-progressbar/smart-progressbar.module";
import { CalendarComponentsModule } from "@app/shared/calendar/calendar-components.module";
import { SmartadminPopupModule } from "./popup/smartadmin-popup.module";
import { CommonSharedModule } from "./common/common-shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    SmartadminLayoutModule,
    BootstrapModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    UserModule,
    SmartadminLayoutModule,
    BootstrapModule,

    I18nModule,

    UtilsModule,
    PipesModule,

    SmartadminFormsLiteModule,

    SmartProgressbarModule,

    InlineGraphsModule,

    SmartadminWidgetsModule,
    SmartadminPopupModule,
    ChatModule,
    StatsModule,
    CommonSharedModule,
    VoiceControlModule,

    CalendarComponentsModule,
  ]
})
export class SharedModule { }
