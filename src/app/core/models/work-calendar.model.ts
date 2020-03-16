import { BaseModel } from "@app/core/models/base.model";

export class WorkCalendarModel extends BaseModel {
  company_id: number = 0;
  factory_id: number = 0;
  calendar_id: number;  
  year: number = 0;
  month: number = 0;
  is_holiday_saturday: boolean = false;
  days: WorkCalendarDayModel[];
  factorys: number[];
}

export class WorkCalendarDayModel extends BaseModel {
  company_id: number = 0;
  factory_id: number = 0;
  calendar_id: number;  
  day: number = 0;
  work_day_type_gencd: string;
  work_day_type: string;
  day_of_week_nm: string;
  holiday_nm: string;
  work_yn: boolean = false;
  payment_yn: boolean = false;
}
