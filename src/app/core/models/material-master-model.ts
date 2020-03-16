import { MainBaseModel } from "./main-base.model";


export class MaterialMasterModel extends MainBaseModel {

    companyId: number = 0;
    materialCd: string = '';
    materialSeq: number = 0;
    itemCateGenCd: string = '';
    bizUnitId: number = 0;
    originGenCd: string = '';
    materialFullNm: string = '';
    materialDsplNm: string = '';
    materialPropertyGenCd: string = '';
    stockUnitGenCd: string = '';
    packingUnitGenCd: string = '';
    packingUnitQty: number = 0;
    expiryMonth: number = 0;
    specGenCd: string = '';
    outsourcingYn: boolean = false;
    comomMaterialYn: boolean = false;
    salesYn: boolean = false;
    salesPrice: number = 0.00;
    conIndexValue: number = 0.00;
    asIsCd: string = '';
    useYn: boolean = true;
    remark: string = '';

}
