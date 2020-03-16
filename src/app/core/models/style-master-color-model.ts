import { MainBaseModel } from "./main-base.model";
export class StyleMasterColorModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    colorId: number = 0;
    colorName: string;
    colorType: boolean = true;
}
