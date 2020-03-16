
import { BaseModel } from "@app/core/models/base.model";

export class HrShiftworkModel extends BaseModel {
  company_id :number = 0;
  depart_id : number = 0;
  hr_id:string='';
  month : number=0;
  year : number=0;
  month_year:string;
 }
