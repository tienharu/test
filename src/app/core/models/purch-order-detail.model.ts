import { MainBaseModel } from "./main-base.model";
import { PurchOrderWonoModel } from "./purch-order-wono.model";
export class PurchOrderDetailModel extends MainBaseModel {
    companyId: number;
    poSheetNo: number;
    tranSeq: Number;
    itemizedGenCd: string ;
    materialCd: number;
    colorId: number;
    poPlanQty: number;
    totalWoNo: number;
    customerCd: number;
    poQty: number;
    price: number;
    amount: number;
    poSheetNoStatus: string;
    poNoCustomer: string;
    poNoStatus: string;
    poUniqueNo: string;
    purchOrderWonos: PurchOrderWonoModel[] = [];
    detailTotal: DetailTotal[] = [];
    woNos: string = '';
    styleNos: string = '';
}

export class DetailTotal extends MainBaseModel {
    ps: number;
    supplier: number;
    items: number;
    poAmount: number;
    status: number;
    poNo: string ='';   
}

