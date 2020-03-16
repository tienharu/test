import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { RoutingMasterModel } from "@app/core/models/routing-master.model";
import { GeneralMasterModel } from "@app/core/models/general_master.model";

@Injectable()
export class RoutingMasterService {
    private routingMasterInfo: RoutingMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.routingMasterInfo = new RoutingMasterModel();
    }

    getModel(): RoutingMasterModel {
        return this.routingMasterInfo;
    }

    resetModel() {
        this.routingMasterInfo = new RoutingMasterModel();
    }

    public listRoutingMasterAll() {
        return new Promise<RoutingMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_routing`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public insertRouting(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_routing`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateRouting(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_routing`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteRouting(id: number) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_routing/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    // public getInventoryUnit(companyId) {
    //     return new Promise<GeneralMasterModel[]>((resolve, reject) => {
    //         this.api.get(`/inventoryUnit/list?companyId=${companyId}`).subscribe(data => {
    //             resolve(data.data);
    //         });
    //     });
    // }

    // public getRoutingClass(companyId) {
    //     return new Promise<GeneralMasterModel[]>((resolve, reject) => {
    //         this.api.get(`/routingClass/list?companyId=${companyId}`).subscribe(data => {
    //             resolve(data.data);
    //         });
    //     });
    // }

    // public getLocations(companyId) {
    //     return new Promise<GeneralMasterModel[]>((resolve, reject) => {
    //         this.api.get(`/location/list?companyId=${companyId}`).subscribe(data => {
    //             resolve(data.data);
    //         });
    //     });
    // }
}