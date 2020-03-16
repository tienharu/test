import { BaseModel } from "@app/core/models/base.model";

export class PayrollMasterModel extends BaseModel {
  company_id: number = 0;
  year: number = 0;
  month: number = 0;
  details: HrEmployeeModel[] = [];
}

export class HrEmployeeModel extends BaseModel {
    company_id: number = 0;
    year: number = 0;
    month: number = 0;
    hr_id: string = "";
    empl_name: string = "";
    start_work: Date;
    duty_type: string="";
    gender: number = 0;
    job_type: string = "";
    job_class: string = "";
    payroll_items: PayrollMasterDetailModel[] = [];
}

export class PayrollMasterDetailModel {
  payroll_item_id: number = 0;
  amount: number = 0;
  payroll_item_name: string = "";
}