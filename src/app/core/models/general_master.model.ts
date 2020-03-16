import { BaseModel } from "@app/core/models/base.model";

export class GeneralMasterModel extends BaseModel {
  company_id: number = 0;
  // gen_id: number = 0;
  cate_cd: string;  
  gen_cd: string;
  gen_nm: string;
  gen_local_nm: string;  
  parent_cd: string;
  ck_value_1: string;
  ck_value_2: string;
  ck_value_3: string;
  number_value_1: number;
  number_value_2: number;
  number_value_3: number;
  seq_value_1: number;
  seq_value_2: number;
  seq_value_3: number;
  text_value_1: string;
  text_value_2: string;
  text_value_3: string;
  sys_cd_yn: string;
}

