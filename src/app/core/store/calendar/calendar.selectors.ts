import * as fromReducer from '@app/core/store/calendar/calendar.reducer'

import { createSelector, createFeatureSelector } from '@ngrx/store';


export const getCalendarState = createFeatureSelector<fromReducer.CalendarState>('calendar')



