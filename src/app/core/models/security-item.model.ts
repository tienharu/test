import { BaseModel } from "@app/core/models/base.model";

export class SecurityItemModel extends BaseModel {
    company_id: number = 0;
    security_item_id: number = 1;
    trans_seq: number = 0;
    sharing_type: number = 0;
    sharing_to_id: number = 0;
}