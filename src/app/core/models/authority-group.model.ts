import { BaseModel } from "@app/core/models/base.model";
import { BasePage } from "../common/base-page";

export class AuthorityGroupModel extends BaseModel {
    company_id: number = 0;
    author_group_id: number = 0;
    author_group_nm: string = '';
    node: string = '';
    is_system:boolean=false;
}

