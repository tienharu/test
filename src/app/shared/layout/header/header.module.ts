import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";

import {PopoverModule} from "ngx-popover";

import {CollapseMenuComponent} from "@app/shared/layout/header/collapse-menu/collapse-menu.component";
import {RecentProjectsComponent} from "@app/shared/layout/header/recent-projects/recent-projects.component";
import {FullScreenComponent} from "@app/shared/layout/header/full-screen/full-screen.component";

import {ActivitiesComponent} from "@app/shared/layout/header/activities/activities.component";
import {ActivitiesMessageComponent} from "@app/shared/layout/header/activities/activities-message/activities-message.component";
import {ActivitiesNotificationComponent} from "@app/shared/layout/header/activities/activities-notification/activities-notification.component";
import {ActivitiesTaskComponent} from "@app/shared/layout/header/activities/activities-task/activities-task.component";
import {HeaderComponent} from "@app/shared/layout/header/header.component";

import {UtilsModule} from "@app/shared/utils/utils.module";
import {PipesModule} from "@app/shared/pipes/pipes.module";
import {I18nModule} from "@app/shared/i18n/i18n.module";
import {UserModule} from "@app/shared/user/user.module";
import {VoiceControlModule} from "@app/shared/voice-control/voice-control.module";
import {BsDropdownModule} from "ngx-bootstrap";
import { HelpComponent } from "@app/shared/layout/header/help/help.component";
import { BookmarkComponent } from "@app/shared/layout/header/bookmark/bookmark.component";
import { MainScreenComponent } from "@app/shared/layout/header/main-screen/main-screen.component";
import { ClockComponent } from "@app/shared/layout/header/clock/clock.component";
import { LatestNewsComponent } from "@app/shared/layout/header/latest-news/latest-news.component";
import { ProfileComponent, ChangePassComponent, ProfileInfoComponent } from "./profile";
import { SearchBarComponent, SearchResultComponent } from "./search-bar";
import { SmartadminPopupModule } from "@app/shared/popup/smartadmin-popup.module";
import { SmartadminValidationModule } from "@app/shared/forms/validation/smartadmin-validation.module";
import { JcropModule } from "@app/shared/forms/jcrop/jcrop.module";
import { InfoNewsDataComponent } from "./latest-news/info-news.component";
import { SmartadminFormsModule } from "@app/shared/forms/smartadmin-forms.module";
import { WidgetsGridComponent } from "@app/shared/widgets";
import { SmartadminWidgetsModule } from "@app/shared/widgets/smartadmin-widgets.module";
import { BootstrapModule } from "@app/shared/bootstrap.module";

@NgModule({
  imports: [
    CommonModule,

    FormsModule,
    JcropModule,
    VoiceControlModule,
    SmartadminFormsModule,
    SmartadminWidgetsModule,
    BootstrapModule,
    BsDropdownModule,
    UtilsModule,PipesModule, I18nModule, UserModule, PopoverModule,SmartadminPopupModule
    //,SmartadminValidationModule
  ],
  declarations: [
    ActivitiesMessageComponent,
    ActivitiesNotificationComponent,
    ActivitiesTaskComponent,
    RecentProjectsComponent,
    FullScreenComponent,
    CollapseMenuComponent,
    ActivitiesComponent,
    HeaderComponent,
    HelpComponent,
    BookmarkComponent,
    MainScreenComponent,
    ClockComponent,
    LatestNewsComponent,
    InfoNewsDataComponent,
    ProfileComponent,
    SearchBarComponent,
    ChangePassComponent,
    ProfileInfoComponent,
    SearchResultComponent,
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule{}
