import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { GlobalMasterModel } from "@app/core/models/global_master.model";
import { WipMasterModel } from "@app/core/models/wip-master.model";
import { RoutingMasterModel } from "@app/core/models/routing-master.model";

@Injectable()
export class WipMasterService {
    private wipMasterInfo: WipMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.wipMasterInfo = new WipMasterModel();
    }

    getModel(): WipMasterModel {
        return this.wipMasterInfo;
    }

    resetModel() {
        this.wipMasterInfo = new WipMasterModel();
    }

    public listWipMasterAll() {
       // console.log("list wip All");
        return new Promise<WipMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_wip`).subscribe(data => {
               // console.log("list wip All", data);
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public insertWip(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_wip`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateWip(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_wip`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteWip(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_wip/${id}`).subscribe(data => {
                resolve(data);
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
}