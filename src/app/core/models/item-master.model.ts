import { MainBaseModel } from "./main-base.model";


export class ItemMasterModel extends MainBaseModel {

    companyId: number = 0;
    itemCd: string = '';
    itemizedGenCd: string = '';
    itemFullNm: string = '';
    itemDsplNm: string = '';
    bizUnitId: number = 0;
    itemCateGenCd: string = '';
    processflowId: string = '';
    brandGenCd: string = '';
    stockUnitGenCd: string = '';
    packGenCd: string = '';
    standardGenCd: string = '';
    sizeGenCd: string = '';
    bodyBarcode: string = '';
    barCodeYn: boolean = false;
    nonSalesYn: boolean = false;
    factoryApprovalYn: boolean = false;
    outsideStockYn: boolean = false;
    discontinueYn: boolean = false;
    expiryDays: number = 0;
    specText: string = '';
    inboxingQty: number = 0.00;
    objectiveQty: number = 0.00;
    conIndexValue: number = 0.00;
    asIsCd: string = '';
    oldBarcode: string = '';
    useYn: boolean = true;
    remark: string = '';
    itemSeq: number = 0;
    checkItem: boolean = false;
}
