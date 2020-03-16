import { BaseModel } from "@app/core/models/base.model";

export class CrmMasServiceCategoryModel extends BaseModel {
        company_id: number = 0;
        crm_service_cate_id: number = 0;
        crm_service_cate_nm: string = "";
        level: number = 1;
        parent_cate_id: number = 0;
        sales_target_yn:  boolean ;
        final_level_yn:  boolean ;
        items: number = 0;
        del_yn: boolean = false;
}
export class CrmMasServiceItemModel extends BaseModel {
        company_id: number = 0;
        crm_item_id: number = 0;
        crm_item_nm: string = "";
        crm_service_cate_id: number = 0;
        vender_text: string = "";
        price: number = 0;
        currency_gen_cd: number = 285100001000;
        item_unit_gen_cd: string = "";
        keyword_text:string = "";
        use_yn: boolean = false;
        del_yn: boolean = false;
}