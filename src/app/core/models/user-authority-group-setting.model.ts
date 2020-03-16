import { BaseModel } from "@app/core/models/base.model";

export class UserAuthorityGroupSettingModel extends BaseModel {
    company_id: number = 0;
    user_id: number;
    user_nm: string;
    author_group_id: number = 0;
    auhtor_group_nm: string;
    is_system:boolean=false;
}