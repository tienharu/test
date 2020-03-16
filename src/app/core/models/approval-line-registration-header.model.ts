
import { BaseModelWithSharingData } from "./base.model";
import { ScannedActionsSubject } from "@ngrx/store";
import { MainBaseModel } from "./main-base.model";
import { ApprovalLineRegistrationDetailModel } from "./approval-line-registration-detail.model";

export class ApprovalLineRegistrationHeaderModel extends MainBaseModel {

companyId: number ;
aprvlLineCd  : number= 0 ;
aprvlLineKoreaNm : string ='';
aprvlLineEngNm  : string = '';
numStep : number = 0;
numRefer : number = 0;
urgentYn : boolean;
useYn : boolean = true;
creator : string = '';
createdTime : string ='';
changer : string ='';
changedTime : string = '';
remark : string = '';
delYn  : boolean = false;
BmApprovalDetail : ApprovalLineRegistrationDetailModel[] = [];
}
export class ApprovalLineRegistrationHeaderModelTemp extends MainBaseModel {

    companyid: number ;
    aprvllinecd  : number= 0 ;
    aprvllinekoreanm : string ='';
    aprvllineengnm  : string = '';
    numstep : number = 0;
    numrefer : number = 0;
    urgentyn : boolean;
    useyn : boolean = true;
    creator : string = '';
    createdtime : string ='';
    changer : string ='';
    changedtime : string = '';
    remark : string = '';
    delyn  : boolean = false;
 }
 
