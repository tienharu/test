import { BaseModel } from "@app/core/models/base.model";

export class HrBasicInfoModel extends BaseModel { 
  company_id : number =0 ;
  hr_id : string = '';
  org_id : number = 0;
  employee_card_id :string = '';
  email : string = '';
  phone : string = '';
  job_type_gen_cd : string = '';
  duty_type_id : number = 0;
  job_class_gen_cd : string = '';
  work_place_gen_cd : string = '';
  tax_code_gen_cd : string = '';
  duty_status_gen_cd : string = '';
  duty_kind_gen_cd : string = '';
  retired_ymd : Date;
  basic_remark : string = '';
  start_work_ymd : Date;
  family_allowance_person : number=0;
  original_annual_leave:number = 12;
  total_annual_leave : number = 0;
  return_health_card_yn : boolean = false;
  duty_status_detail_gen_cd : string = '';
}
