import { MainBaseModel } from "./main-base.model";
export class StyleMasterYieldModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    styleYieldId : number = 0;
    netYield: number;
    lostYield: number;
    totalYield: number;
    constructionGenCd: string;
}
