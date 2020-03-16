import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SmartProgressbarModule} from "@app/shared/ui/smart-progressbar/smart-progressbar.module";
import {TreeViewModule} from "@app/shared/ui/tree-view/tree-view.module";
import {JqueryUiModule} from "@app/shared/ui/jquery-ui/jquery-ui.module";
import {NestableListModule} from "@app/shared/ui/nestable-list/nestable-list.module";

@NgModule({
  imports: [CommonModule],

  exports: [SmartProgressbarModule, JqueryUiModule, NestableListModule, TreeViewModule],
})
export class SmartadminUiModule{}
