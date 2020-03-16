import { BaseModel } from "@app/core/models/base.model";
export class HrContractInfoModel extends BaseModel {
    company_id: number = 0;
    hr_id: string = '';
    trans_seq: number = 0;
    from_ymd: string;
    to_ymd?: string='';
    contract_no: number = 0;
    contract_number: string;
    unlimitted?: boolean;
    attachment: string = '';
    
}