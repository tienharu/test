import { Injectable } from "@angular/core";
import { MultiLanguageService } from "./mutil-language.service";
@Injectable()
export class OtherService1 {
  languages: any;
  constructor(private langService: MultiLanguageService) {   
  }        

  translateMsgBox(property: string, content: string) {}  
  translate(property: string) {    
    this.languages = this.langService.getAllLanguageKeys();
    let label = this.languages[property.toLocaleUpperCase()];            
    if (label != undefined && label != '') 
        return this.languages[property.toLocaleUpperCase()];
    else                 
        return property.toLocaleUpperCase()   
    } 
}
