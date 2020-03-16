import { BaseModel } from "@app/core/models/base.model";

export class HrCetificateModel extends BaseModel { 
  company_id : number =0 ;
  hr_id : string = '';
  trans_seq : number = 0;
  cetificated_ymd? : Date;
  cetificated_type_gen_cd : string = '';
  cetificated_text : string = '';
  expire_ymd? : Date ;
  cetificated_gen_cd : string = '';
  
}
