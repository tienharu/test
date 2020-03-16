import { MainBaseModel } from "./main-base.model";
export class StyleMasterModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    orderType: boolean = true;
    styleNo: string;
    styleName: string;
    styleStatusGenCd: string = '';
    brandGenCd: string = '';
    buyerCd: number;
    venderCd: number;
    styleCategoryGenCd: string;
    styleTypeGenCd: string;
    orderRecvYmd: Date;
    orderQty: number;
    price: number;
    amount:number;
    swatchYn: boolean;
    colorYn: boolean;
    yieldYn: boolean;
    rowYn: boolean;
    subYn: boolean;
    poYn: boolean;
    closedYmd: Date;
    cancelYmd: Date;
}

