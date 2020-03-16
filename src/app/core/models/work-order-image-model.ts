import { MainBaseModel } from "./main-base.model";
export class WorkOrderImageModel extends MainBaseModel {
    companyId: number = 0;
    woNo: number;
    stepSeq: number;
    uploadType: number;
    uploadSeq: number;
    uploadPass: string;
}
