import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromCalendar from "@app/core/store/calendar";
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';

declare var $: any;

@Component({
  selector: 'sa-analytics',
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit, CanDeactivateGuard {

  public calendar$
  constructor(
    private store: Store<any>
  ) {
    this.calendar$ = this.store.select(fromCalendar.getCalendarState);
  }

  ngOnInit() {
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
