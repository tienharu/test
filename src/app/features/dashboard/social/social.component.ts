import { Component, OnInit } from '@angular/core';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { Observable } from "rxjs/Observable";

declare var $: any;

@Component({
  selector: 'sa-social',
  templateUrl: './social.component.html',
})
export class SocialComponent implements OnInit, CanDeactivateGuard {

  ngOnInit() {
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
