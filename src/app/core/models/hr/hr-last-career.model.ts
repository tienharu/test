import { BaseModel } from "@app/core/models/base.model";

export class HrLastCareerModel extends BaseModel {
    company_id : number = 0;
    hr_id : string = '';
    trans_seq : number = 0;
    last_company_nm : string = '';
    last_work_nm : string = '';
    last_position : string = '';
    last_joined_ymd? : Date;
    last_retired_ymd? : Date;
    
 }
