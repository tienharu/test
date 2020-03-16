import { BaseModel } from "@app/core/models/base.model";

export class HrAnnualLeaveModel extends BaseModel {
  company_id: number = 0;
  hr_id: string = '';
  org_id: number = -99;
  trans_seq: number = 0;
  attend_log_gen_cd: string = '';
  from_date: string = '';
  to_date: string = '';
  total_day?: number;
  reason_nm: string = '';
  attachment_file: string = '';
  apprl_yn: boolean = false;
  apprl_by: number = 0;
  apprl_date: string = '';

  // company_id: number ;
  // hr_id: string ;
  // factory_id: number ;
  // annual_leave_gen_cd: string ;
  // from_date: string ;
  // to_date: string ;
  // total_day?: number;
  // reason_nm: string ;
  // attachment_file: string ;
  // apprl_yn: boolean ;
  // apprl_by: number ;
  // apprl_date: string ;
}

export class HrAnnualLeaveApprlModel extends BaseModel {
  company_id: number = 0;
  hr_id: string = '';
  factory_id: number = 0;
  trans_seq: number = 0;
  apprl_by: number = 0;
}