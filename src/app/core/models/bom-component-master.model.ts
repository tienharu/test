import { MainBaseModel } from "./main-base.model";
import { BomAssyMasterModel } from "./bom-assy-master.model";


export class BomComponentMasterModel extends MainBaseModel {

    assyItemId: string = '';
    bomComponentSeq: number = 0;
    companyId: number = 0;
    bomComponentId: string = '';
    bomAssyId: string = '';
    bomQty: number = 0;
    useYn: boolean = true;
    remark: string = '';
    itemized: string;
    unit: string;
    bomComponentItemNm: string;
    bom: string;
    act: string;
}

export class BomComponentItem {
    constructor(){
    }
    bomComponentName: string;
    bomComponentNo: string;
    bomId: string;
    bomStatus: number;
    itemizedGenName: string;
    stockUnitGenName: string;
    active: boolean;
}
