import { MainBaseModel } from "./main-base.model";

export class StyleMasterMaterialModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    colorIdStyle: number;
    materialCd: number;
    itemizedGenCd: string;
    constructionGenCd: string;
    colorId: number;
    materialQty: number;
    netYield: number;
    lossYield: number;
    totalYield: number;
    needQty: number;
    materialModel: MasMaterialModel
}

export class MasMaterialModel {
    SpecGenCd: string;
    SpecGenNm: string;
    StockUnitGenCd: string;
    StockUnitGenNm: string;
}

