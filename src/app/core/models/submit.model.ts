import { BaseModel } from "@app/core/models/base.model";

export class SubmitModel extends BaseModel {
    submit_id: number = 0;
    username: string = '';
    email: string = '';
    password: string = '';
    company_id: number = 0;
    user_id: number = 0;
  }