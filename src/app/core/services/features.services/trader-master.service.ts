import { TraderModel } from "@app/core/models/trader.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { resolve } from "path";
import { reject } from "q";
import { UserModel } from "@app/core/models/user.model";

@Injectable()
export class TraderService {
    private TraderInfo: TraderModel;

    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.TraderInfo = new TraderModel();
    }

    getModel(): TraderModel {
        return this.TraderInfo;
    }

    storeTemporaryModel(TraderInfo: TraderModel) {
        this.TraderInfo = TraderInfo;
    }

    resetModel() {
        this.TraderInfo = new TraderModel();
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
    public ShortList(company_id) {
        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get("trader/shortlist?companyid=" + company_id).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data);
            });
        });
    }

    // public ListTraderPaging(company_id,cateGenCd:any='',inchargeId:any='',keyword:any='',crmYn : any='',crmPartnerYn : any='',favouriteYn:any='',page:any='', pageSize:any='') {

    //     if (company_id <= 0) {
    //         return new Promise<any>((resolve, reject) => {
    //             resolve([]);
    //         });
    //     }
    //     this.notificationService.showCenterLoading();
    //     return new Promise<any>((resolve, reject) => {
    //         this.api.get("trader/list?companyid=" + company_id + "&cateGenCd="+ cateGenCd +"&inchargeId=" +inchargeId+ "&keyword="+ keyword + "&crmYn="+ crmYn +"&crmPartnerYn="+crmPartnerYn + "&favouriteYn=" + favouriteYn +"&page=" + page +"&pagesize=" + pageSize ).subscribe(data => {
    //             this.notificationService.hideCenterLoading();
    //             if (data.error) {
    //                 this.notificationService.showMessage("error", data.error.message);
    //                 resolve([]);
    //                 return;
    //             }
    //             resolve(data)
    //         })
    //     })
    // }
    public GetListBySearch(companyId,cateGenCd, inchargeId,keyword,crmYn,crmPartnerYn, favouriteYn,page, pageSize) {

        if (companyId <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        this.notificationService.showCenterLoading();
        return new Promise<any>((resolve, reject) => {
            this.api.get(`trader/list?companyId=${companyId}&cateGenCd=${cateGenCd}&inchargeId=${inchargeId}&keyword=${keyword}&crmYn=${crmYn}&crmPartnerYn=${crmPartnerYn}&favouriteYn=${favouriteYn}&page=${page}&pageSize=${pageSize}`).subscribe(data => {
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


    public InsertTrader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("trader/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public DeleteTrader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("trader/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }
}