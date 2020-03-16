import { Component, OnInit } from '@angular/core';
import { I18nService } from '@app/shared/i18n/i18n.service';

@Component({
  selector: 'sa-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.css']
})
export class MainInfoComponent implements OnInit {

  constructor(private i18nService: I18nService) { }

  ngOnInit() {
  }

}
