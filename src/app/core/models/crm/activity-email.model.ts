import { BaseModel } from "@app/core/models/base.model";

export class CrmActivityEmailModel extends BaseModel {
        company_id: number = 0;
        input_func_id: number = 0;
        func_ref_id: number = 0;
        email_id: number = 0;
        email_title_type: number = 0;
        title_nm: string = "";
        email_ymd: any;
        contents: string = "";
        del_yn: boolean = false;
        email_details :crmActivityEmailDetailModel[] = [];
        default: any[] = [];
}
export class crmActivityEmailDetailModel extends BaseModel {

        company_id: number = 0;
        input_func_id: number = 0;
        func_ref_id: number = 0;
        email_id: number = 0;
        trans_seq: number = 0;
        with_type: number = 0;
        with_ref_id: number = 0;
        person_type: number = 0;
        default_yn: boolean = false;
        del_yn: boolean = false;
}