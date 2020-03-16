import { BaseModel } from "@app/core/models/base.model";

export class CrmActivityMeetingModel extends BaseModel {
        company_id: number = 0;
        input_func_id: number = 0;
        func_ref_id: number = 0;
        meeting_id: number = 0;
        title_nm: string = "";
        place : string = "";
        meeting_ymd: any;
        contents: string = "";
        del_yn: boolean = false;
        meeting_details :crmActivityMeetingDetailModel[] = [];
        meeting_persons :crmActivityMeetingPersonModel[] = [];
}
export class crmActivityMeetingDetailModel extends BaseModel {

        company_id: number = 0;
        input_func_id: number = 0;
        func_ref_id: number = 0;
        meeting_id: number = 0;
        trans_seq: number = 0;
        with_type: number = 0;
        with_ref_id: number = 0;
        person_type: number = 0;
        default_yn: boolean = false;
        del_yn: boolean = false;
}
export class crmActivityMeetingPersonModel extends BaseModel {

    company_id: number = 0;
    input_func_id: number = 0;
    func_ref_id: number = 0;
    meeting_id: number = 0;
    person_id: number = 0;
    person_type: number = 0;
    del_yn: boolean = false;
}