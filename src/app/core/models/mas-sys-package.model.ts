import { BaseModel } from "@app/core/models/base.model";

export class MasSysPackage extends BaseModel {
  pack_id: number = 0;
  pack_nm: string = '';
  money_amount: number = 0.00;
  payment_type: number = 0;
}