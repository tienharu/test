import { BaseModel } from "@app/core/models/base.model";

export class HrMedicalInfoModel extends BaseModel {
  company_id :number = 0;
  hr_id : string = '';
  trans_seq : number =0;
  medical_ymd : Date;
  medical_nm : string = '';
  medical_result : string = '';
 }
