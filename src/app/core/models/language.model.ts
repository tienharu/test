import { BaseModel } from "@app/core/models/base.model";

export class LanguageListModel {
    lang_cd: string ;
    description: string = '';    
}

export class CountryLangModel {
    lang_key: string = '';
    lang_name: string = '';
    lang_title: string = '';
}

export class KeywordLanguageModel {
    lang_id: number = 0;    
    lang_cd: string = '';
    type: string = '';    
    program_cd: string = '';
    remark: string = '';    
    languages_data:any=[];
}