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
import { BankBookMasterModel } from "@app/core/models/bank-book-master.model";

@Injectable()
export class BankBookMasterService {
    private BankBookMasterInfo: BankBookMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.BankBookMasterInfo = new BankBookMasterModel();
    }

    getModel(): BankBookMasterModel {
        return this.BankBookMasterInfo;
    }

    resetModel() {
        this.BankBookMasterInfo = new BankBookMasterModel();
    }
    
    public listBankBookMasterAll() {
        return new Promise<BankBookMasterModel[]>((resolve, reject) => {
            
            this.api.get(`/mas-bank-book/list`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                // var resol : BankBookMasterModel[] = [];
                // for(var i = 0; i< data.data.length ; i++){
                //     var a = this.setObj(new BankBookMasterModel ,data.data[i]);
                //     resol[i] = a;
                // }
                resolve(data.data);
                
            });
        });
    }
    public listBankBookMasterId(id:any) {
        return new Promise<BankBookMasterModel[]>((resolve, reject) => {
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
    //Table insert and update, delete
    public insertBankBookMaster(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`/mas-bank-book`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public updateBankBookMaster(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`/mas-bank-book`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public deleteBankBookMaster(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`/mas-bank-book/${id}`).subscribe(data => {
                resolve(data);
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

}