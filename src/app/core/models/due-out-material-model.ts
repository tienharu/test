import { MainBaseModel } from "./main-base.model";
export class DueOutMaterialModel extends MainBaseModel {
    companyId: number = 0;
    dueOutNo: number = 0;
    woNo: number;
    stepSeq: number;
    styleSysId: number = 0;
    styleNo: string;
    buyerCd : number;
    dueOutType : boolean;
    workPlaceValue : string = '';
    processGenCd : string = '';
    eta : string = '';
    workQty: number = 0;
    price: number = 0;
    amount: number = 0;
}

export class DueOutMaterialTableModel extends MainBaseModel {
    no: number = 0;
    ck: boolean;
    itemizedGenCd: string = '';
    materialCd: string = '';
    dueOutNo: number;
    unit: string;
    constructionGenCd : string = '';
    colorIdMaterial : number;
    totalYield : number;
    needQty : string = '';
    currentQty :number;
    // currentQty : string = '';
    dueOutQty: string = '';
    balanceQty: string = '';
}
