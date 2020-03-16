import { BaseModel } from "@app/core/models/base.model";

export class PayrollItemModel extends BaseModel {
  company_id: number = 0;
  payroll_item_id: number = 0;
  payroll_item_name: string = "";  
  add_deduct_type: boolean = false;
  sbt_yn: boolean = false;
  sbt_column_seq: number = 0;
  sbt_column_seq_temp: number = 0;
  tax_yn: boolean = false;
  order_seq: number = 0;
  insurance_yn: boolean = false;
  mapping_item_id:number=0
}
