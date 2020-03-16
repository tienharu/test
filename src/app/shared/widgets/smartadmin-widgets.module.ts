import {NgModule} from "@angular/core";
import {WidgetComponent} from "@app/shared/widgets/widget/widget.component";
import {WidgetsGridComponent} from "@app/shared/widgets/widgets-grid/widgets-grid.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [WidgetComponent, WidgetsGridComponent],
  exports: [WidgetComponent, WidgetsGridComponent]
})
export class SmartadminWidgetsModule{}
