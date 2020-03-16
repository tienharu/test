import { BaseModel } from "@app/core/models/base.model";
export class HrInsuranceInfoModel extends BaseModel {
    company_id: number = 0;
    hr_id: string = '';
    insurance_no: string = '';
    insurance_gen_cd: string = '';
    insurance_rate: number = 0;
    insurance_money: number = 0;
    apply_yn: boolean;
    apply_ymd: Date;
    
}