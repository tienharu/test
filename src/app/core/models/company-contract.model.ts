import { BaseModel } from "@app/core/models/base.model";

export class CompanyContractModel extends BaseModel {
  company_id: number = 0;
  company_seq: number = 0;
  pack_id: number = -1;
  contract_name: string = '';
  contract_no: string = '';
  contract_person: string = '';
  contract_date: string = '';
  attach_document: string = '';
  payment_money_amount: number = 0;
  attach_document_data: {
    file_name: string,
    file_type: string,
    value: string
  };
  setting_ymd = 'N/A'
}