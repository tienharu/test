import { CountryLangModel, KeywordLanguageModel } from '@app/core/models/language.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '../notification.service';
import { Injectable } from '@angular/core';
import { SystemMenuService } from './system-menu.service';

@Injectable()
export class LanguageSettingService {

    constructor(private api: CRMSolutionApiService,
        private notification: NotificationService,
    ) {
    }

    /** List of all languages keywords */
    getLangsKeywordsByCountry(langColName:string) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`/languages/list/${langColName}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    /** List of countries language */
    getLangCountriesDefined() {
        return new Promise<CountryLangModel[]>((resolve, reject) => {
            this.api.get(`/languages/list-langs`).subscribe(data => {
                resolve(data.data);
            });
        });
    }
    /** List of all languages keywords */
    getAllLangsKeywords(progCd:any,type:any) {
        return new Promise<KeywordLanguageModel[]>((resolve, reject) => {
            this.api.get(`/languages/list-keywords`).subscribe(data => {
                resolve(data.data);
            });
        });
    }
    addNewKeyword(model: KeywordLanguageModel) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`/languages/keyword/add`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    updateKeyword(model: KeywordLanguageModel) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`/languages/keyword/update`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    updateManyKeywords(listKeywords: KeywordLanguageModel[]) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`/languages/keyword/update-multi`, listKeywords).subscribe(data => {
                resolve(data);
            });
        });
    }
    deleteKeywords(keywords: string[]) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`/languages/keyword/delete`, keywords).subscribe(data => {
                resolve(data);
            });
        });
    }
}