import { BaseModel, BaseModelV2 } from "./base.model";

export class CompanyCfModel extends BaseModelV2 {
    companyid: number = 0;
    companyscfcd: string = '';
    standardacctcd: string = '';
    sortorder: number = 1000;
    acctkoreanm: string = '';
    acctengnm: string = '';
    scfpropergid : string ='';
    acctlevel : string ='1';
    dsplspace: string = '1';
    parentscfcd : string ='';
    parentsumtype : string ='1';
    finalyn : boolean = false;
    is_system:boolean=false;
}

export class ParentType {
    name: string;
    value: any;
}


export class FsType {
    name: string;
    value: any;
}

export class SpaceCompanyCfCodeModel{
    companyid: number = 0;
    fstype : string ='';
    dsplspace: string = '';
}

export class CopyCompanyCfCodeModel{
    fromcompanycd: number = 0;
    tocompanycd : number = 0;
    fstype: string = '';
}

export class SettingCompanyCfCodeModel{
    settingtype: string = '';
    companycode : number = 0;
    fstype: string = '';
}