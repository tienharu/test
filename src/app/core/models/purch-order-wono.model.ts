import { MainBaseModel } from "./main-base.model";
export class PurchOrderWonoModel extends MainBaseModel {
    companyId: number = 0;
    poSheetNo: number = 0;
    transSeq: number = 0;
    woNo: number = 0;
    woSeq: number = 0;
    styleNo: String = '';
    styleSysId: number = 0;
}