import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { GlobalMasterModel } from "@app/core/models/global_master.model";
import { RoutingMasterModel } from "@app/core/models/routing-master.model";
import { ItemMasterModel } from "@app/core/models/item-master.model";
import { ApprovalLineRegistrationHeaderModel, ApprovalLineRegistrationHeaderModelTemp } from "@app/core/models/approval-line-registration-header.model";
import { ApprovalLineRegistrationDetailModel, ApprovalLineRegistrationSysUsers, ApprovalLineRegistrationDetailModelTemp } from "@app/core/models/approval-line-registration-detail.model";
import { OrganizationModel } from "@app/core/models/organization.model";

@Injectable()
export class  ApprovalLineRegistrationService {
    private ApprovalLineRegistrationInfo: ApprovalLineRegistrationHeaderModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.ApprovalLineRegistrationInfo = new ApprovalLineRegistrationHeaderModel();
    }

    getModel(): ApprovalLineRegistrationHeaderModel {
        return this.ApprovalLineRegistrationInfo;
    }

    resetModel() {
        this.ApprovalLineRegistrationInfo = new ApprovalLineRegistrationHeaderModel();
    }
    
setObj(obj1 : ApprovalLineRegistrationHeaderModel,obj2 : ApprovalLineRegistrationHeaderModelTemp){
    obj1.companyId = obj2.companyid,
    obj1.aprvlLineCd = obj2.aprvllinecd,
    obj1.aprvlLineKoreaNm = obj2.aprvllinekoreanm,
    obj1.aprvlLineEngNm = obj2.aprvllineengnm,
    obj1.numStep = obj2.numstep,
    obj1.numRefer = obj2.numrefer,
    obj1.urgentYn = obj2.urgentyn,
    obj1.useYn = obj2.useyn,
    obj1.creator = obj2.creator,
    obj1.createdTime = obj2.createdtime,
    obj1.changer = obj2.changer,
    obj1.changedTime = obj2.changedtime,
    obj1.remark = obj2.remark,
    obj1.delYn = obj2.delyn
    return obj1
}
setObj2(obj1 : ApprovalLineRegistrationDetailModel,obj2 : ApprovalLineRegistrationDetailModelTemp){
    obj1.companyId= obj2.companyid;
    obj1.aprvlLineCd= obj2.aprvllinecd;
    obj1.transSeq= obj2.transseq;
    obj1.aprvlProcsGen= obj2.aprvlprocsgen;
    obj1.approverTypeGen= obj2.approvertypegen;
    obj1.stepValue= obj2.stepvalue;
    obj1.mainApproverId= obj2.mainapproverid;
    obj1.subApproverId= obj2.subapproverid;
    obj1.mainCompInOutValue= obj2.maincompinoutvalue;
    obj1.subCompInOutValue= obj2.subcompinoutvalue;
    obj1.mainApproverUserName= obj2.mainapproverusername;
    obj1.subApproverUserName= obj2.subapproverusername;
    obj1.mainApproverPositionGid= obj2.mainapproverpositiongid;
    obj1.subApproverPositionGid= obj2.subapproverpositiongid;
    obj1.useYn= obj2.useyn;
    obj1.creator= obj2.creator;
    obj1.createdTime= obj2.createdtime;
    obj1.changer= obj2.changer;
    obj1.changedTime= obj2.changedtime;
    obj1.remark= obj2.remark;
    obj1.delYn= obj2.delyn;
    return obj1
}
    public listApprovalLineRegistrationHeaderAll() {
        return new Promise<ApprovalLineRegistrationHeaderModel[]>((resolve, reject) => {
            
            this.api.get(`/mas-approval-line`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                var resol : ApprovalLineRegistrationHeaderModel[] = [];
                for(var i = 0; i< data.data.length ; i++){
                    var a = this.setObj(new ApprovalLineRegistrationHeaderModel ,data.data[i]);
                    resol[i] = a;
                }
                resolve(resol);
                
            });
        });
    }
    public listApprovalLineRegistrationDetailAll(id:any) {
        return new Promise<ApprovalLineRegistrationDetailModelTemp[]>((resolve, reject) => {
            this.api.get(`/mas-approval-line-approver/${id}`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    //Table-header insert and update, delete
    public insertApprovalHeader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`/mas-approval-line`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public updateApprovalHeader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`/mas-approval-line`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public deleteApprovalHeader(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`/mas-approval-line/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
    //Table-detail insert and update, delete
    public insertApprovalDetail(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`/mas-approval-line-approver`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public updateApprovalDetail(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`/mas-approval-line-approver`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteApprovalDetail(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`/mas-approval-line-approver/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
    public listSysUsers(id:any) {
        return new Promise<ApprovalLineRegistrationSysUsers[]>((resolve, reject) => {
            this.api.get(`/user/list?companyId=${id}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    public getPositions(companyId) {
        return new Promise<GeneralMasterModel[]>((resolve, reject) => {
          this.api
            .get(`/position/list?companyId=${companyId}`)
            .subscribe(data => {
              resolve(data.data);
            });
        });
      }

      public listOrganization(companyId) {
        return new Promise<OrganizationModel[]>((resolve, reject) => {
          this.api
            .get(`/org/list?companyId=${companyId}`)
            .subscribe(data => {
              if (!data.success) {
                this.notificationService.showMessage("error", data.data.message);
                resolve([]);
                return;
              }
              resolve(data.data);
            });
        });
      }

    public listGeneralProcess(id:any) {
        return new Promise<GeneralMasterModel[]>((resolve, reject) => {
            this.api.get(`/General/details/catecd/${id}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                if (!data.success) {
                    this.notificationService.showMessage("error", data.data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    public listGeneralType(id:any) {
        return new Promise<GeneralMasterModel[]>((resolve, reject) => {
            this.api.get(`/General/details/catecd/${id}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                if (!data.success) {
                    this.notificationService.showMessage("error", data.data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public listGeneralItemized() {
        return new Promise<GeneralMasterModel[]>((resolve, reject) => {
            this.api.get(`/general/list/wip-itemized`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                if (!data.success) {
                    this.notificationService.showMessage("error", data.data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public listGlobalByType() {
        return new Promise<GlobalMasterModel[]>((resolve, reject) => {
            this.api.get(`/global/material/biz-unit`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                if (!data.success) {
                    this.notificationService.showMessage("error", data.data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    public listRouting() {
        return new Promise<RoutingMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_routing`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                if (!data.success) {
                    this.notificationService.showMessage("error", data.data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    
    public listItemMasterAll() {
        return new Promise<ItemMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_item`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
}