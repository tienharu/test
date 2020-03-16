import { BaseModel } from "@app/core/models/base.model";

export class HrAppraisalInfoModel extends BaseModel {
  company_id :number = 0;
  hr_id : string = '';
  trans_seq : number =0;
  eval_ymd : Date;
  eval_period_gen_cd : string = '';
  eval_type_gen_cd : string = '';
  eval_result_gen_cd : string = '';
  capability_level_gen_cd : string = '';
  
 }
