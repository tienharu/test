import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "../api/crm-solution-api.service";
import { LanguageSettingService } from "./features.services/language-setting.service";

@Injectable()
export class MultiLanguageService {
    defaultLanguage: any = { code: "English", key: "us", name: "English" };
    currentLangKey = 'cur_lang';
    allLangSupported = 'all_langs';
    languageStorageKey = 'languages';
    constructor(private api: CRMSolutionApiService, private languageService: LanguageSettingService,) {
    }

    public initLanguageSupported() {
        var savedAllLangs=this.getCountryLangFromLocal();
        if(savedAllLangs){
            return new Promise<any>((resolve, reject) => {
                resolve(savedAllLangs);
              });
        }
        //return this.languageService.getLangCountriesDefined();
        return this.languageService.getLangCountriesDefined().then(res=>{
            this.setCountryLangToLocal(res);
            return new Promise<any>((resolve, reject) => {
                resolve(res);
              });
        });
    }
    public initLanguageKeys(langCode) {
        if (localStorage.getItem(this.currentLangKey)==null || localStorage.getItem(this.currentLangKey) == 'undefined') {
            this.setCurrentLanguage(this.defaultLanguage)
        }
        if (!localStorage.getItem(this.languageStorageKey) || localStorage.getItem(this.languageStorageKey) == 'undefined') {
            this.loadLanguageKeys(langCode)
        }
    }
    public loadLanguageKeys(langCode) {
        return new Promise<any>(
            (resolve, reject) => {
                this.languageService.getLangsKeywordsByCountry(langCode).then(res=>{
                    if (res.error || !res.data) {
                        resolve({'ok':false})
                    }
                    else{
                        var langKeys = res.data;
                        localStorage.setItem(this.languageStorageKey, JSON.stringify(langKeys));
                        resolve({'ok':true})
                    }
                });
            }
        );
    }
    public refreshLanguageKey(){
        var cur=this.getCurrentLanguage();
        this.loadLanguageKeys(cur.code);
    }
    public getCurrentLanguage(): any {
        if (localStorage.getItem(this.currentLangKey)) {
            return JSON.parse(localStorage.getItem(this.currentLangKey));
        }
        return this.defaultLanguage;
    }
    public setCurrentLanguage(newLang:any) {
        localStorage.setItem(this.currentLangKey,JSON.stringify(newLang));
    }

    public setCountryLangToLocal(allLangs:any) {
        localStorage.setItem(this.allLangSupported,JSON.stringify(allLangs));
    }

    public getCountryLangFromLocal():any {
        if (localStorage.getItem(this.allLangSupported)) {
            return JSON.parse(localStorage.getItem(this.allLangSupported));
        }
        return null;
    }

    public getAllLanguageKeys(){
        return JSON.parse(localStorage.getItem(this.languageStorageKey));
    }
    public removeAllLanguageKeys(){
        localStorage.removeItem(this.allLangSupported);
        localStorage.removeItem(this.languageStorageKey);
    }
}