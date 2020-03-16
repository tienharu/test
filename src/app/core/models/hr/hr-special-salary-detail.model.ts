import { BaseModel } from "@app/core/models/base.model";

export class HrSpecialSalaryDetailModel extends BaseModel {
        company_id : number = 0;
        year : number = 0;
        month: number = 0;
        special_pay_item_id : number = 0;
        hr_id : string = "";
        amount :number = 0;
        type:string ="";
 }
