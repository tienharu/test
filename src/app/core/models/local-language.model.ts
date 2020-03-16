import { BaseModelV2 } from "./base.model";

export class LocalLanguageModel extends BaseModelV2 {
    companyid: number = 0;
    locallanguagegid: string = '';
    companyacctcd: string = '';
    fstype: string = '';
    wholenm: string = '';
    simnm: string = '';
}

export class FsTypeModels {
    name: string;
    value: any;
}
