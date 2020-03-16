import { BaseModel, BaseModelWithSharingData } from "@app/core/models/base.model";
export class TraderModel extends BaseModelWithSharingData {
    trader_id: number = 0;
    company_id: number = 0;
    type_gen_cd: string = '';
    cate_gen_cd: string = '';
    channel_gen_cd: string = '';
    proper_gen_cd: string = '';
    trader_local_nm: string = '';
    trader_eng_nm : string ='';
    trader_sim_nm : string ='';
    incharge_id: number = 0;
    crm_yn: boolean;
    crm_partner_yn: boolean;
    important_gen_cd: string = '';
    num_people: number = 0;
    sale_amount: number = 0;
    biz_regist_num: string = '';
    biz_conditions: string = '';
    biz_type: string = '';
    ceo_nm: string = '';
    zip_code: string = '';
    email: string = '';
    phone: string = '';
    address: string = '';
    foreign_ym: boolean;
    favourite_yn : boolean;
    country_gen_cd: string = '';
    pay_terms_gen_cd: string = '';
    home_page: string = '';
    src_trader_cd: string = '';
    trader_cate_name: string = '';
}