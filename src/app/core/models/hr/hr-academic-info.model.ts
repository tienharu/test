import { BaseModel } from "@app/core/models/base.model";

export class HrAcademicInfoModel extends BaseModel {
  company_id :number = 0;
  hr_id : string = '';
  trans_seq : number = 0;
  school_type_gen_cd : string = '';
  school_nm : string = '';
  start_ymd : Date;
  graduated_type_cd : string = '';
  major_nm : string = '';
  diploma_level_gen_cd : string = '';
  doctorate_nm : string = '';
  graduated_ymd : Date;
 }
