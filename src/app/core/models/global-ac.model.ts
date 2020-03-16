import { BaseModel, BaseModelV2 } from "./base.model";

export class GlobalAcModel extends BaseModelV2 {
    companyid: number = 0;
    standardacctcd: string = '';
    fstype: string = '1';
    sortorder: number = 1000;
    dsplspace: string = '';
    acctkoreanm: string = '';
    acctsimkoreanm: string = '';
    acctengnm: string = '';
    acctsimengnm: string = '';
    drcr: string = '1';
    is_system : boolean=false
}

export class FsType {
    name: string;
    value: any;
}

export class DrCrType {
    name: string;
    value: any;
}