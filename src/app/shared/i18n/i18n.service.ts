import { Injectable, ApplicationRef } from '@angular/core';

import { config } from '@app/core/smartadmin.config';
import { languages } from '@app/shared/i18n/languages.model';
import { Subject } from 'rxjs';
import { MultiLanguageService } from '@app/core/services/mutil-language.service';

@Injectable()
export class I18nService {

  public state;
  public data: {};
  public currentLanguage: any;

  constructor(private langService: MultiLanguageService, private ref: ApplicationRef) {
    this.state = new Subject();

    // this.initLanguage(config.defaultLocale || 'us');
    // this.fetch(this.currentLanguage.key)
    this.data = this.langService.getAllLanguageKeys();
    this.state.next(this.data);
    //this.ref.tick()
  }

  
  setLanguage(language) {
    // this.currentLanguage = language;
    // this.fetch(language.key)
  }

  subscribe(sub: any, err: any) {
    return this.state.subscribe(sub, err)
  }

  public getTranslation(phrase: string): string {
    var key:any = phrase;
    if(phrase){
      key=phrase.toLocaleUpperCase();
    }
    return this.data && this.data[key] ? this.data[key] : phrase
  }
}
