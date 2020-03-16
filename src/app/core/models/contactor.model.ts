import { BaseModelWithSharingData } from "@app/core/models/base.model";

export class ContactorModel extends BaseModelWithSharingData {
    company_id: number = 0;
    contactor_id : number = 0;
    trader_id : number = 0;
    contactor_nm : string ='';
    contactor_dept_nm : string ='';
    contactor_position_nm : string ='';
    contactor_type_gen_cd : string = '';
    rule_gen_cd : string ='';
    level_gen_cd : string ='';
    am_id : number = 0;
    priority_value : number = 0;
    email : string ='';
    mobile_no : string ='';
    tel_no : string ='';
    emergency_tel_no : string ='';
    address : string ='';
    favourite_yn : boolean;
    recommend_contactor_id : number = 0;
}
