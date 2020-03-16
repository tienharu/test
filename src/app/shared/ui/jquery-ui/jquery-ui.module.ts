import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JquiDialogLauncher} from "@app/shared/ui/jquery-ui/jqui-dialog/jqui-dialog-launcher.directive";
import {JquiAccordion} from "@app/shared/ui/jquery-ui/jqui-accordion.directive";
import {JquiMenu} from "@app/shared/ui/jquery-ui/jqui-menu.directive";
import {JquiAutocomplete} from "@app/shared/ui/jquery-ui/jqui-autocomplete.directive";
import {JquiProgressbar} from "@app/shared/ui/jquery-ui/jqui-progressbar.directive";
import {JquiSpinner} from "@app/shared/ui/jquery-ui/jqui-spinner.directive";
import {JquiSlider} from "@app/shared/ui/jquery-ui/jqui-slider.directive";
import {JquiTabs} from "@app/shared/ui/jquery-ui/jqui-tabs.directive";
import {JquiDialog} from "@app/shared/ui/jquery-ui/jqui-dialog/jqui-dialog.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    JquiDialog,
    JquiDialogLauncher,
    JquiAccordion,
    JquiMenu,
    JquiAutocomplete,
    JquiProgressbar,
    JquiSpinner,
    JquiSlider,
    JquiTabs,
  ],
  exports: [
    JquiDialog,
    JquiDialogLauncher,
    JquiAccordion,
    JquiMenu,
    JquiAutocomplete,
    JquiProgressbar,
    JquiSpinner,
    JquiSlider,
    JquiTabs,
  ]
})
export class JqueryUiModule {
}
