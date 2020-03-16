import { BaseModel } from "@app/core/models/base.model";

export class PackageModel extends BaseModel {
    company_id: number = 0;
    pack_id: number=0;
    pack_nm: string;
    money_amount:number=0;
    payment_type:number=0;
    node: string = '';
    user_amount:number=0;
}

