import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MultiLanguageService } from '@app/core/services/mutil-language.service';
@Component({
  selector: 'sa-language-selector',
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {
  public languagesSupported: Array<any>;
  public currentLanguage: any ={};
  constructor(
    private langService: MultiLanguageService) {
  } 
     
  ngOnInit() {
    this.langService.initLanguageSupported().then(data => {
      this.languagesSupported = data;   
    });  
    this.currentLanguage=this.langService.getCurrentLanguage();
    this.langService.initLanguageKeys(this.currentLanguage.code);
  }

  setLanguage(language){    
    this.currentLanguage={code:language.lang_name,key:language.lang_key,name:language.lang_title};
    this.langService.setCurrentLanguage(this.currentLanguage)
    this.langService.loadLanguageKeys(this.currentLanguage.code).then(x=>{
      setTimeout(function(){
            window.location.reload();
          },10);
    })
    
  }
}
