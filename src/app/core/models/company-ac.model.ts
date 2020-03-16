import { BaseModel, BaseModelV2 } from "./base.model";

export class CompanyAcModel extends BaseModelV2 {
    companyid: number = 0;
    companyacctcd: string = '';
    standardacctcd: string = '';
    sortorder: number = 1000;
    acctkoreanm: string = '';
    acctengnm: string = '';
    acctclassgid : string='';
    ficlassgid : string ='';
    drcr: string = '1';
    parentsumtype : string ='1';
    acctlevel: string ='1';
    dsplspace: string = '1';
    parentacctcd : string ='';
    acctpropergid : string ='';
    inventtypegid : string ='';
    fstype : string ='1';
    subsys : string ='';
    srcacctcd : string = '';
    baclassgid : string ='';
    unsettledyn : boolean = false;
    is_system:boolean=false;
}
export class FsTypeModel {
    name: string;
    value: any;
}

export class DrCrModel {
    name: string;
    value: any;
}

export class ParentModel {
    name: string;
    value: any;
}

export class SpaceCompanyAcCodeModel{
    companyid: number = 0;
    fstype : string ='';
    dsplspace: string = '';
}

export class CopyCompanyAcCodeModel{
    fromcompanycd: number = 0;
    tocompanycd : number = 0;
    fstype: string = '';
}

export class SettingCompanyAcCodeModel{
    settingtype: string = '';
    companycode : number = 0;
    fstype: string = '';
}