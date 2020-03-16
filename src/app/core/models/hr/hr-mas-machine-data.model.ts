import { BaseModel } from "../base.model";

export class HrMasMachineDataModel extends BaseModel {

    company_id : number = 0;
    check_cd : number = 0;
    hr_id : string = '';
    employee_nm : string ='';
    employee_card_cd : string='';
    check_ymd : string ='';
    check_date : string = '';
    source_cd : string = '';
    fromDate : string='';
    toDate: string='';
    
}

export class SearchMachineDataModel  {
    company_id : number = 0;
    hr_id : string = '';
    fromDate : string='';
    toDate: string='';
    
}