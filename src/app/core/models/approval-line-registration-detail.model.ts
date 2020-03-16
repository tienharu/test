import { BaseModelWithSharingData } from "./base.model";
import { MainBaseModel } from "./main-base.model";

export class ApprovalLineRegistrationDetailModel extends MainBaseModel {
    companyId: number;
    aprvlLineCd: number;
    transSeq: number;
    aprvlProcsGen: string = '';
    approverTypeGen: string = '';
    stepValue: number;
    mainApproverId: number;
    subApproverId: number;
    mainCompInOutValue: string = '';
    subCompInOutValue: string = '';
    mainApproverUserName: string = '';
    subApproverUserName: string = '';
    mainApproverPositionGid: string = '';
    subApproverPositionGid: string = '';
    useYn: boolean = true;
    creator: string = '';
    createdTime: string = '';
    changer: string = '';
    changedTime: string = '';
    remark: string = '';
    delYn: boolean = false;
}
export class ApprovalLineRegistrationDetailModelTemp extends MainBaseModel {
    companyid: number;
    aprvllinecd: number;
    transseq: number;
    aprvlprocsgen: string = '';
    approvertypegen: string = '';
    stepvalue: number;
    mainapproverid: number;
    subapproverid: number;
    maincompinoutvalue: string = '';
    subcompinoutvalue: string = '';
    mainapproverusername: string = '';
    subapproverusername: string = '';
    mainapproverpositiongid: string = '';
    subapproverpositiongid: string = '';
    useyn: boolean = true;
    creator: string = '';
    createdtime: string = '';
    changer: string = '';
    changedtime: string = '';
    remark: string = '';
    delyn: boolean = false;
}
export class ApprovalLineRegistrationSysUsers extends MainBaseModel {
    companyid: number;
    user_id: number;
    user_nm: string = '';
    superyn: boolean;
    email: string = '';
    usermainscr: string = '';
    userlanguage: string = '';
    orggencd: string = '';
    orgnm: string = '';
    position_gen_cd: string = '';
    positionnm: string = '';
}