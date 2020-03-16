import { BaseModel } from "@app/core/models/base.model";

export class HrTraningInfoModel extends BaseModel {
  company_id :number = 0;
  hr_id : string = '';
  trans_seq : number = 0;
  from_ymd : Date;
  training_type_gen_cd : string = '';
  training_sum_hour? : number;
  organizer_gen_cd :string = '';
  last_score? : number;
  after_score? : number;
  final_score? : number;
  cetificate_yn : boolean = false;
 }
