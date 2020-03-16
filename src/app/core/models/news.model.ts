import { BaseModel } from "./base.model";
export class NewsModel extends BaseModel {
    company_id: number=0;
    id : number = 0;
    cate_gen_cd : string ='';
    title : string ='';
    description : string = '';
    content : string ='';
    thumbnail : string = '';
}

export class NewsHeaderModel extends BaseModel {
    company_id: number=0;
    id : number = 0;
    title : string ='';
    
}