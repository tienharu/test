

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {I18nModule} from "@app/shared/i18n/i18n.module";
import {BigBreadcrumbsComponent} from "@app/shared/layout/navigation/big-breadcrumbs.component";
import {MinifyMenuComponent} from "@app/shared/layout/navigation/minify-menu.component";
import {NavigationComponent} from "@app/shared/layout/navigation/navigation.component";
import {SmartMenuDirective} from "@app/shared/layout/navigation/smart-menu.directive";
import {UserModule} from "@app/shared/user/user.module";
import {RouterModule} from "@angular/router";
import {ChatModule} from "@app/shared/chat/chat.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    UserModule,
    ChatModule
  ],
  declarations: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
  ],
  exports: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
  ]
})
export class NavigationModule{}
