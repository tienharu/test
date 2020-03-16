import { BaseModelWithSharingData } from "@app/core/models/base.model";

export class CrmProjectModel extends BaseModelWithSharingData {
    company_id : number = 0;
    project_id : number = 0;
    salesopt_id : number = 0;
    project_type_gen_cd : string = "";
    project_nm : string = "";
    start_ymd : any;
    end_ymd : any;
    work_hours : string = "";
    memo_text : string = "";
    del_yn : boolean = false;
    salesopt_nm : string = "";
    customer_nm : string = "";
    contractor_nm : string = "";
    customer_id : number = 0;
    contractor_id : number = 0;
    project_type_nm : string = '';
}