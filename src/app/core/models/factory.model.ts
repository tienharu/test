import { BaseModel } from "@app/core/models/base.model";

export class FactoryModel extends BaseModel {
    company_id : number = 0;
    factory_id :number = 0;
    factory_nm_local : string = '';
    factory_nm_eng : string = '';
    parent_fac_id : number = 0;
}



