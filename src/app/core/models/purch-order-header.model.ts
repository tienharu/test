import { MainBaseModel } from "./main-base.model";
import { PurchOrderDetailModel } from "./purch-order-detail.model";
export class PurchOrderHeaderModel extends MainBaseModel {
    companyId: number;
    poSheetNo: number;
    poSheetYmd: string;
    totalWoNo: number;
    totalSupplier: number = 0;
    totalMaterials: number = 0;
    totalAmount: number = 0;
    purchOrderDetails: PurchOrderDetailModel[] = [];
}

export class PoSheetPopupModel{
    poSheetNo: number = null;
    fromPoDate: string = '';
    toPoDate: string = '';
    statusCd: string = '';
    supplier: number;
    issued: number;
    bal: number;
    poSheetNoStatus: boolean;
}

export class SearchPOSheetModel{
    companyId: number = null;
    poSheetNo: number = null;
    fromPoDate: string = null;
    toPoDate: string = null;
    statusCd: string = null;
}


