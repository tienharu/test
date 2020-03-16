import { BaseModel } from "@app/core/models/base.model";

export class HrRewardPunishModel extends BaseModel {
  company_id :number = 0;
  hr_id : string = '';
  trans_seq : number = 0;
  from_ymd : Date;
  to_ymd : Date;
  reward_punish_type : number = 1;
  reward_punish_reason : string = '';
  issued_by : string = '';
 }
