import { MainBaseModel } from "./main-base.model";
export class StyleMasterPOModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    poId: number;
    poNo: string;
    deliveryYmd: Date;
    destinationGenCd: string;
    poQty: number;
    lossRate: number;
    planQty: number;
    price: number;
    amount: number;
    sizeGroupGenCd: string;
}