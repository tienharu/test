import { MainBaseModel } from "./main-base.model";
import { InboundStyleDetailModel } from "./inbound-style-detail.model";

export class InboundStyleHeaderModel extends MainBaseModel {
    companyId: number;
    styleInboundNo: string;
    inboundYmd: string;
    woNo: number;
    stepSeq: number;
    supplierCd: number;
    buyerCd: number;
    locationGenCd: string;
    processGenCd: string;
    poId: number;
    poNo: string = '';
    inboundQty: number;
    price: number;
    amount: number;
    details: InboundStyleDetailModel[] = [];
}