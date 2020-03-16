import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { ModalHeaderComponent } from "./modal-header/modal-header.component";
import { ModalComponent } from "./modal";

@NgModule({
  imports: [CommonModule],
  declarations: [ModalHeaderComponent, ModalComponent],
  exports: [ModalHeaderComponent, ModalComponent]
})
export class SmartadminPopupModule{}
