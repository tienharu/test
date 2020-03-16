import { BaseModel } from "@app/core/models/base.model";

export class CompanyModel extends BaseModel {
  company_id: number = 0;
  submit_id: number = 0;
  user_id: number = 0;
  pack_id: number = -1;
  company_local_nm: string = '';
  company_eng_nm: string = '';
  company_sim_nm: string = '';
  company_type: number = 1;// default value = '1'
  com_regist_num: string = '';
  biz_regist_num: string = '';
  biz_conditions_gen_cd: string = '';
  biz_type_gen_cd: string = '';
  zip_code: string = '';
  address: string = '';
  ceo_local_nm: string = '';
  tel_no: string = '';
  fax_no: string = '';
  email: string = '';
  homepage: string = '';
  biz_keyword: string = '';
  country_gen_cd: string = '';
  currency_gen_cd: string = '';
  contract_count: number = 0;
  usingType: string = 'Free';
  payment_level: string = '';
  money_month: number = 0;
}