import { BaseModel } from "@app/core/models/base.model";

export class AuthorityGroupMenuSettingModel extends BaseModel {
    company_id: number = 0;
    menu_id: number = 0;
    author_group_id: number = 0;
    is_system:boolean=false;
}