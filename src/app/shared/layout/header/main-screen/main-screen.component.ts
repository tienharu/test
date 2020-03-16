import {Component, OnInit} from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';

declare var $: any;

@Component({
  selector: 'sa-main-screen',
  templateUrl: './main-screen.component.html'
})
export class MainScreenComponent {

  constructor(
    private layoutService: LayoutService
  ) {

  }

  onSetMainScreen() {
  }
}
