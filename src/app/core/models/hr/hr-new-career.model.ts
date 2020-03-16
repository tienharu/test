import { BaseModel } from "@app/core/models/base.model";

export class HrNewCareerModel extends BaseModel {
    company_id : number = 0;
    hr_id : string = '';
    trans_seq : number = 0;
    path_ymd : Date;
    path_gen_cd : string;
    from_org_cd : number = 0;
    to_org_cd? : number = 0;
    from_job_type_gen_cd : string = '';
    to_job_type_gen_cd : string = '';
    from_hr_class_gen_cd : string = '';
    to_hr_class_gen_cd : string = '';
    from_duty_kind_gen_cd : string = '';
    to_duty_kind_gen_cd : string = '';
    from_duty_type_id? : number;
    to_duty_type_id? : number;
    from_work_place_gen_cd : string = '';
    to_work_place_gen_cd : string = '';
    from_tax_cd_gen_cd : string = '';
    to_tax_cd_gen_cd : string = '';
    from_duty_status_gen_cd : string = '';
    to_duty_status_gen_cd : string = '';
    reason :string = '';
    
 }
