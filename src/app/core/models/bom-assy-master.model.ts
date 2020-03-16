import { MainBaseModel } from "./main-base.model";
import { BomComponentMasterModel } from "./bom-component-master.model";
import { ProcessFlowPathRouteModel } from "./process-flow-path-route-model";


export class BomAssyMasterModel extends MainBaseModel {

    bomAssyId: string = '';
    bomAssySeq: number = 0;
    companyId: number = 0;
    bizUnitId: number = 0;
    bomName: string = '';
    bomNo: string = '';
    setYmd: string;
    itemizedGenCd: string = '';
    processflowUkId: string = '';
    assyItemCd: string = '';
    lossRatio: number = 0;
    limitRatio: number = 0;
    mixRatio: number = 0.00;
    bomStatus: number = 1;
    useYn: boolean = true;
    remark: string = '';
    //bmMasBomComponentAssyItem: BomAssyMasterModel[] = [];
    processlowUk: ProcessFlowPathRouteModel;
    bmMasBomComponent: BomComponentMasterModel[] = [];
}

export class BomSearchModel {
    bomNo: string = '';
    bizUnitId: number = 0;
    itemizedGenCd: string = '';
    bomStatus: number = 0;
    parentItemName: string = '';
    assyItemName: string = '';
}

export class BomProcessFlowDetail {
    itemizedGenCd: string = '';
    itemizedGenName: string = '';
    processPathRouteId: string = '';
    processflowUkId: number = 0;
    routeId: string = '';
    routeName: string = '';
    routeSeq: number = null;
    stockUnitGenName: string = '';
}

export class BomItem {
    itemCd: string = "";
    itemSeq: string = "";
    itemNm: string = "";
    itemizedCd: string = "";
    itemizedNm: string = "";
    stockUnitNm: string = "";
}

export class BomCopyItem {
    bomAssyId: string = '';
    assyItemCd: string = '';
    bomName: string = '';
}
