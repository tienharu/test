import { BaseModel } from "@app/core/models/base.model";

export class HrMaternityInfoModel extends BaseModel {
    company_id: number = 0;
    hr_id: string = '';
    pregnant_7th_month: string = '';
    meternity_leave_by_doc: string = '';
    maternity_leave_real: string = '';
    child_birthday: string = '';
    child_7th_month: string = '';
    day_off_after_born: number = 0;
    back_to_work_date: string = '';
}