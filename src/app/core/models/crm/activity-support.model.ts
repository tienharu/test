import { BaseModel } from "../base.model";

export class CrmProjectTaskModel extends BaseModel {
    company_id : number = 0;
    project_task_id : number = 0;
    project_id : number = 0;
    project_task_type_gen_cd : string = '';
    project_task_nm : string = '';
    start_ymd : any;
    work_hour : number = 0;
    work_minute : number = 0;
    work_unit_gen_cd : string = '';
    work_place_text : string = '';
    contents : string = '';
    del_yn:boolean = false;
    project_task_person : CrmProjectTaskPersonModel[] = [];
}

export class CrmProjectTaskPersonModel extends BaseModel {
    company_id : number = 0;
    project_task_id : number = 0 ;
    person_id : number = 0;
    person_type : boolean;
    worker_yn : boolean;
    del_yn : boolean  = false;
}