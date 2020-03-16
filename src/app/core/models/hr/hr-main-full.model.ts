import { BaseModel } from "@app/core/models/base.model";

export class HrMainFullModel extends BaseModel {
    company_id :number = 0;
    hr_id : string = '';
    employee_nm : string ='';
    employee_nm_simple : string = '';
    image_url : string = '';
    national_id :string = '';
    birth_ymd : string = '';
    birth_country_gen_cd : string = '';
    birth_address : string = '';
    gender : number = 1;
    married_yn : boolean =false;
    child_number?: number;
    training_yn : boolean = false;
    bankbook_num1 : string = '';
    bank_nm1 : string = '';
    bankbook_num2 : string = '';
    bank_nm2 : string = '';
    tax_no : string = '';
    address : string = '';
    source_hr_cd : string  = '';

    org_id : number = 0;
    employee_card_id :string = '';
    email : string = '';
    phone : string = '';
    salary_code_gen_cd : string = '';
    duty_type_gen_cd : string = '';
    hr_class_gen_cd : string = '';
    work_place_gen_cd : string = '';
    tax_code_gen_cd : string = '';
    duty_status_gen_cd : string = '';
    duty_kind_gen_cd : string = '';
    retired_ymd : Date;
    insurance_count : number = 0;
 }
