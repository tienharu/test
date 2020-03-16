import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Action
} from "@ngrx/store";

import { environment } from "@env/environment";

import * as auth from "@app/core/store/auth";
import * as notify from "@app/core/store/notify";
import * as profile from "@app/core/store/profile";
import * as layout from "@app/core/store/layout";
import * as calendar from "@app/core/store/calendar";

export interface AppState {
  auth: auth.AuthState;
  notify: notify.NotifyState;
  profile: profile.ProfileState;
  layout: layout.LayoutState;
  calendar: calendar.CalendarState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: auth.authReducer,
  notify: notify.notifyReducer,
  profile: profile.profileReducer,
  layout: layout.layoutReducer,
  calendar: calendar.calendarReducer,
};

// console.log all actions
export function logger(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    // if (
    //   // !action.silent &&
    //   environment.log.store
    // ) {
    //   // console.log("\nstate", state);
    //   // console.log("+ action", action);

    // }

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];

export const effects = [
  auth.AuthEffects,
  notify.NotifyEffects,
  profile.ProfileEffects,
  layout.LayoutEffects,
  calendar.CalendarEffects,
];

export const services = [notify.NotifyService];
