import { MainBaseModel } from "./main-base.model";
import { fileUploadDataModel } from "@app/core/models/file-upload-data.model";
export class StyleMasterSwatchModel extends MainBaseModel {
    companyId: number = 0;
    styleSysId: number;
    swatchId: number = 0;
    swatchName: string;
    swatchNo: string;
    attachFiles: string;
    uploadFiles: fileUploadDataModel=null;
}
