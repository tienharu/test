import { BaseModel } from "@app/core/models/base.model";

export class RequestJoinModel extends BaseModel {
    email: string = '';
    fullname: string = '';
    username: string = '';
    password: string = '';
    confirmPassword: string = '';
}