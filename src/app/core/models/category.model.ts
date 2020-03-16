import { BaseModel } from "@app/core/models/base.model";

export class CategoryModel extends BaseModel {
    cate_id: number = 0;
    cate_cd: string;
    cate_nm: string;
    cate_rule: string;
}

