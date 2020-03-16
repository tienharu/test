import { MainBaseModel } from "./main-base.model";
export class WorkOrderWorkTypeModel extends MainBaseModel {
    companyId: number = 0;
    woNo: number;
    stepSeq: number;
    worktypeGenCd: string;
    customerCd: number;
}
