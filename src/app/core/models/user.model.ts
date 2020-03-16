import { BaseModel } from "@app/core/models/base.model";

export class UserModel extends BaseModel {
    company_id: number = 0;
    user_id: number = 0;
    user_nm: string = '';
    password: string = '';
    full_name: string = '';
    email: string = '';
    user_main_scr: string = '';
    user_language: string = '';
    avatar: string = '';
    org_id: number = 0;
    position_gen_cd: string = '';
    super_yn: boolean = true;
    temp_pass_change_yn: boolean = false;
    
    // hr_cd: number = 0;
     //use_sys: string = '1';
    // biz_unit_uid: string = '';
    // bizplace_cd: string = '';
}
export class ResetPassModel{
    user_id: number;
    user_nm: string;
    password: string;
    confirm_password: string;
}
export class ChangePassModel{
    password: string;
    new_password: string;
    confirm_password: string;
}

export class UserFavoriteMenuModel{
    company_id: string;
    user_id: string;
    menu_id: number;
    menu_name:string;
    program_cd:string;
}