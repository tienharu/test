import { MainBaseModel } from "./main-base.model";
export class DueOutMaterialDetailModel extends MainBaseModel {
    companyId: number = 0;
    dueOutNo: number;
    materialCd : number;
    itemizedGenCd: string = '';
    colorIdMaterial: number;
    constructionGenCd: string = '';
    totalYield: number;
    needQty : number;
    currentQty : number;
    dueOutQty : number;
    balanceQty : number;
}
