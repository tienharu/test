import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {HeaderModule} from "@app/shared/layout/header/header.module";
import {FooterComponent} from "@app/shared/layout/footer/footer.component";
import {NavigationModule} from "@app/shared/layout/navigation/navigation.module";
import {RibbonComponent} from "@app/shared/layout/ribbon/ribbon.component";
import {ShortcutComponent} from "@app/shared/layout/shortcut/shortcut.component";
import {ToggleActiveDirective} from "@app/shared/utils/toggle-active.directive";
import {LayoutSwitcherComponent} from "@app/shared/layout/layout-switcher.component";
import { MainLayoutComponent } from '@app/shared/layout/app-layouts/main-layout.component';
import { EmptyLayoutComponent } from '@app/shared/layout/app-layouts/empty-layout.component';
import {RouterModule} from "@angular/router";
import { AuthLayoutComponent } from '@app/shared/layout/app-layouts/auth-layout.component';
import {TooltipModule, BsDropdownModule} from "ngx-bootstrap";
import { RouteBreadcrumbsComponent } from '@app/shared/layout/ribbon/route-breadcrumbs.component';
import {UtilsModule} from "@app/shared/utils/utils.module";
import { I18nModule } from "@app/shared/i18n/i18n.module";
import { LoadingCenterComponent } from "./loading";

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    NavigationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    UtilsModule,


    TooltipModule,
    BsDropdownModule,
    I18nModule,
  ],
  declarations: [
    LoadingCenterComponent,
    FooterComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
    MainLayoutComponent,
    EmptyLayoutComponent,
    AuthLayoutComponent,
    RouteBreadcrumbsComponent,
  ],
  exports:[
    HeaderModule,
    NavigationModule,
    FooterComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
  ]
})
export class SmartadminLayoutModule{

}
