import { MainBaseModel } from "./main-base.model";
export class WorkOrderMasterModel extends MainBaseModel {
    companyId: number = 0;
    woNo: number;
    stepSeq: number;
    styleSysId: number;
    styleNo: string;
    inning: number = 1;
    sampleStepGenCd: string = "";
    poId: number = -1;
    poNo: string = "";
    image: string;
    attachFiles: string;
}

export class SearchWorkOrderModel{
    woNo: number;
    styleNo: string;
    orderType: boolean;
    inning: number;
    sampleStepGenCd: string;
    buyer: number;
    brand: string;
}