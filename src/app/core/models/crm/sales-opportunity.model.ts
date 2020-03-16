import { BaseModel, BaseModelWithSharingData } from "@app/core/models/base.model";

export class CrmSalesOpportunityModel extends BaseModelWithSharingData {
    
   company_id : number = 0;
   salesopt_id : number = 0;
   salesopt_nm : string = "";
   salesopt_type_gen_cd : string = "";
   admin_id : number = 0;
   contractor_id : number = 0;
   contractor_contactor_id : number = 0;
   customer_id : number = 0;
   customer_contactor_id : number = 0;
   del_yn : boolean = false;
   salesopt_type_nm : string = "";
   contractor_nm: string = "";
   contractor_contactor_nm : string = "";
   customer_nm : string = "";
   customer_contactor_nm : string = "";
   admin_nm : string = "";
   sale_activitys : CrmSalesActivityModel = new CrmSalesActivityModel();
}
export class CrmSalesActivityModel extends BaseModel {
        company_id : number = 0;
        activity_id : number = 0;
        salesopt_id : number = 0;
        sales_status_gen_cd : string = "";
        possibility : number = 0;
        expect_amt : number = 0;
        purch_amt? : number = 0;
        issue_text : string = "";
        memo_text : string = "";
        del_yn : boolean = false;
        activity_ymd:any;
        activity_fin_ymd?:any;
        sales_status_gen_nm : string = "";
        sales_status_num:number = 0;
}