import { BaseModel } from "@app/core/models/base.model";

export class HrFamilyInfoModel extends BaseModel {
  company_id :number = 0;
  hr_id : string = '';
  trans_seq : number = 0;
  relate_gen : string = '';
  family : string = '';
  birth_ymd : string;
  phone : string = '';
  duty_place : string = '';
  national_id : string = '';
  social_insurance_num : string = '';
  medical_insurance_num : string = '';
 }
