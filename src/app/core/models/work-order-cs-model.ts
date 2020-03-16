import { MainBaseModel } from "./main-base.model";
export class WorkOrderCSModel extends MainBaseModel {
    companyId: number = 0;
    woNo: number;
    stepSeq: number;
    colorId: number;
    sizeId: number;
    qty: number;
}
