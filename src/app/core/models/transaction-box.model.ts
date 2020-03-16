import { BaseModel, BaseModelV2 } from "./base.model";

export class TransactionBoxModel extends BaseModelV2 {
    companyid: number = 0;
    transid: number = 0;
    transkoreanm: string = '';
    transengnm: string = '';
    transgroupgid: string = '';
    aprvllinecd: number = 0;
    lptype: string = '1';
    sortorder: number = 1000;
    programid: string = '';
    arrayTransactionBoxCd: TransactionBoxCdModel[] = [];
}

export class TransactionBoxCdModel extends BaseModelV2 {
    companyid: number = 0;
    transid: number = 0;
    transseq: number = 0;
    companyacctcd: string = '';
    drcr: string = '';
    bizunittypegid: string = '';
    companyscfcd: string = '';
    scfsumvalue: string = '1';
    budgetcd: number = 0;
    budgetsumvalue: string = '';
}

export class LedgerTypeModel {
    name: string;
    value: any;
}

export class DrCrType {
    name: string;
    value: any;
}