import { BaseModel } from "@app/core/models/base.model";

export class HrSalaryModel extends BaseModel {
    company_id :number = 0;
    job_type_gen_cd: string = "";
    job_class_gen_cd: string = "";
    sbt_year : number = 0;
    sbt_month : number = 0;
    sbt_basic_amt : number = 0;
    sbt_1_atm : number = 0;
    sbt_2_atm : number = 0;
    sbt_3_atm : number = 0;
    sbt_4_atm : number = 0;
    sbt_5_atm : number = 0;
    sbt_6_atm : number = 0;
    sbt_7_atm : number = 0;
    sbt_8_atm : number = 0;
    sbt_9_atm : number = 0;
}
export class HeaderModel{
    month:number=0;
    year:number=0;
    month_year: string ="";
    jobTypeId:string='';
    jobClassId:string='';
  }