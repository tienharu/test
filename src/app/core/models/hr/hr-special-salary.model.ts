import { BaseModel } from "@app/core/models/base.model";
import { OrganizationModel } from "../organization.model";

export class HrSpecialSalaryModel extends BaseModel {
        company_id : number = 0;
        year : number = 0;
        month: number = 0;
        special_pay_item_id : number = 0;
        special_pay_item_nm : string = "";
        tax_yn :boolean = false;
        orgid: number = 0;
 }
