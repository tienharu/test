import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { AppState } from "@app/core/store";
import { Store } from "@ngrx/store";


@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private store: Store<AppState>) {

    // this.store.dispatch({
    //   type: AuthActionTypes.AppInit
    // });

    // this.store.select(state => state)
    //   .pipe(filter(_ => environment.debug))
    //   .subscribe(_ => {
    //   window['SMARTADMIN_APP_STATE'] = _
    // })
  }


}

