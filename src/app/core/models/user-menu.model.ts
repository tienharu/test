import { BaseModel } from "@app/core/models/base.model";

export class UserMenuModel extends BaseModel {
    rank: number = 0;
    company_id: number = 0;
    user_id: number = 0;
    author_group_id: number = 0;
    menu_id: number = 0;
    dspl_yn: number = 0;
    reset_yn: number = 0;
    search_yn: number = 0;
    save_yn: number = 0;
    delete_yn: number = 0;       
    excel_yn: number = 0;       
    posting_yn: number = 0;           
    use_yn: boolean = false;           
}