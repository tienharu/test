import {Component, OnInit} from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';

declare var $: any;

@Component({
  selector: 'sa-help',
  templateUrl: './help.component.html'
})
export class HelpComponent {

  constructor(
    private layoutService: LayoutService
  ) {

  }

  onToggleHelp() {
  }
}
