import { BaseModel, BaseModelV2, BaseModelV3 } from "./base.model";
export class PurchasingHeaderModel extends BaseModelV3 {
    companyId: number;
    puchNo: number;
    purchYmd: string;
    purchType: boolean = false;
    poSheetNo: number;
    supplierCd: number;
    totalAmount: number = 0;
    purchDetailList: PurchasingDetailtModel[] = [];
}

export class PurchasingDetailtModel extends BaseModelV2 {
    companyId: number;
    puchNo: number;
    materialCd: number;
    itemizedGenCd: string = '';
    colorId: number;
    inQty: number;
    actPrice: number;
    purchAmount: number;
    styleNo: string = '';
    styleSysId: number = 0;
    poUniqueNo: string;
    purchLineStatus: string;
    extraQty: number;
}

export class SearchPoModel {
    companyId: number = 0;
    fromPoDate: string = '';
    toPoDate: string = '';
    statusCd: string = '-1';
    poSheetNo: number = 0;
    supplier: number = 0;
}

export class ResultPOModel {
    puchNo: number;
    poType: boolean = false;
    transSeq: number;
    itemizedGenCd: string;
    itemizedGenNm: string;
    materialDsplNm: string;
    materialCd: number;
    unit: string;
    colorId: number;
    colorName: string;
    poQty: number;
    price: number;
    amount: number;
    poUniqueNo: string;
    inedQty: number;
    pricePurch: number;
    poNoStatus: string;
}