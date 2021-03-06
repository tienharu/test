import { NgModule, ModuleWithProviders, APP_INITIALIZER , Optional, SkipSelf } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { StoreModule } from "@ngrx/store";
import { environment } from "@env/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { IonicStorageModule } from "@ionic/storage";
import { EffectsModule } from "@ngrx/effects";
import { AppEffects } from "@app/core/app.effects";
import * as fromStore from "@app/core/store";

import {services, TokenInterceptor} from '@app/core/services'
import { throwIfAlreadyLoaded } from '@app/core/guards/module-import.guard';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    // HotkeysModule.forRoot(),

    StoreModule.forRoot(fromStore.reducers, {
      metaReducers: fromStore.metaReducers
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([...fromStore.effects, AppEffects])
  ],
  exports: [],
  providers: [

    ...services,
    ...fromStore.services,

    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: AuthTokenFactory,
    //   deps: [AuthTokenService],
    //   multi: true
    // },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}
