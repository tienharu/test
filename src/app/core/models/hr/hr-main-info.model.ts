import { BaseModel } from "@app/core/models/base.model";
import { fileUploadDataModel } from "@app/core/models/file-upload-data.model";
export class HrListSearchModel {
  company_id :number;
  departId:any = "-1";
  keyword : string = '';
  filterStatus : any ='-1';
  from:string='';
  to:string='';
}
export class HrMainInfoModel extends BaseModel {
    company_id :number = 0;
    hr_id : string = '';
    employee_nm : string ='';
    employee_nm_simple : string = '';
    image_url : string = '/assets/img/epl_avatar.jpg';
    entrance_ymd : string = '';
    national_id :string = '';
    birth_ymd : string = '';
    birth_country_gen_cd : string = '';
    birth_address_gen_cd : string = '';
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
    job_type_gen_cd : string = '';
    duty_type_id : number = 0;
    job_class_gen_cd : string = '';
    work_place_gen_cd : string = '';
    tax_code_gen_cd : string = '';
    duty_status_gen_cd : string;
    duty_kind_gen_cd : string = '';
    retired_ymd : Date;
    image_data : fileUploadDataModel=null;
    basic_remark : string ='';
    pregnant_y_n : boolean = false;
 }
export class EmployeeExtraInfo{
  insurance_count : number = 0;
  last_contract_info:HrLastContractInfo
}
 export class HrLastContractInfo{
  last_contract_from: string = '';
  last_contract_to: string = '';
  last_contract_no: string = '';
 }
