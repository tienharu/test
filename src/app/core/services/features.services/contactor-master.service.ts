import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { resolve } from "path";
import { reject } from "q";
import { UserModel } from "@app/core/models/user.model";
import { ContactorModel } from "@app/core/models/contactor.model";

@Injectable()
export class ContactorService {
    private ContactorInfo: ContactorModel;

    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.ContactorInfo = new ContactorModel();
    }

    getModel(): ContactorModel {
        return this.ContactorInfo;
    }

    resetModel() {
        return this.ContactorInfo = new ContactorModel();
    }

    storeTemporaryModel(ContactorInfo: ContactorModel) {
        this.ContactorInfo = ContactorInfo;
    }

    public ListTrader(company_id) {
        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get("trader/list?companyid=" + company_id).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    public ListContactor(company_id,trader_id:any='') {

        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get("contactor/list?companyid=" + company_id +"&traderid="+trader_id).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data.data)
            })
        })
    }
    public ShortList(company_id,trader_id:number=0) {

        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get("contactor/shortlist?companyId=" + company_id +"&traderId="+trader_id).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data)
            })
        })
    }
    public GetListBySearch(companyId,keyword:any='', traderId:Number=0,contactorType:any='',adminId:number=0,level:any='',rule:any='', favouriteYn:any='',page:number, pageSize:any='') {

        if (companyId <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        this.notificationService.showCenterLoading();
        return new Promise<any>((resolve, reject) => {
            this.api.get(`contactor/list?companyId=${companyId}&keyword=${keyword}&traderId=${traderId}&contactorType=${contactorType}&adminId=${adminId}&level=${level}&rule=${rule}&favouriteYn=${favouriteYn}&page=${page}&pageSize=${pageSize}`).subscribe(data => {
                this.notificationService.hideCenterLoading();
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data)
            })
        })
    }

    public InsertContactor(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("contactor/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public DeleteContractor(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("contactor/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }
}
