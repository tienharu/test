import { MainBaseModel } from "./main-base.model";
export class StyleMasterPOCSModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    poId: number;
    colorId: number;
    sizeId: number;
    qty: number;
}
