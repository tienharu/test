import { MainBaseModel } from "./main-base.model";
import { MasMaterialModel } from "./style-master-material-model";
export class WorkOrderMaterialModel extends MainBaseModel {
    companyId: number = 0;
    woNo: number;
    stepSeq: number;
    colorIdStyle: number;
    colorId: number;
    materialCd: number;
    itemizedGenCd: string;
    constructionGenCd: string;
    materialQty: number;
    netYield: number;
    lossYield: number;
    totalYield: number;
    needQty: number;
    materialModel: MasMaterialModel
}
