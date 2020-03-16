import { MainBaseModel } from "./main-base.model";

export class InboundStyleDetailModel extends MainBaseModel {
    companyId: number;
    styleInboundNo: string;
    inboundSeq: number;
    colorId: number;
    sizeId: number;
    inQty: number;
}

export class ReceivedDataInboundDetailModel {
    woNo: number;
    stepSeq: number;
    colorId: number;
    sizeId: number;
    inQty: number;
}