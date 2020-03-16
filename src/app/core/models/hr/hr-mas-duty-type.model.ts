import { BaseModel } from "@app/core/models/base.model";
import { PayrollItemModel } from "./hr-payroll-item.model";

export class DutyTypeModel extends BaseModel {
    company_id: number = 0;
    duty_type_id: number = 0;
    duty_type_nm: string = "";
    start_work_time: string = "";
    end_work_time: string = "";
    select_range_machine_from: string = "";
    select_range_machine_to: string = "";
    ot_table_id: number = 0;
    overlap_date_yn: boolean;
    ot_before_start_yn: boolean;
    ot_before_minute: number = 0;
    max_working_time: number = 0;
    round_ot_type: number = 0;
    night_time_from: string = "";
    night_time_to: string = "";
    use_yn: boolean;
    payroll_items: PayrollItemModel = new PayrollItemModel();
}
