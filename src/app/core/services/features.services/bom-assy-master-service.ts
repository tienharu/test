import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { BomAssyMasterModel } from "@app/core/models/bom-assy-master.model";
import { ProcessFlowPathRouteModel } from "@app/core/models/process-flow-path-route-model";
import { BomComponentMasterModel } from "@app/core/models/bom-component-master.model";

@Injectable()
export class BomAssyMasterService {
    private bomAssyMasterInfo: BomAssyMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.bomAssyMasterInfo = new BomAssyMasterModel();
    }

    getModel(): BomAssyMasterModel {
        return this.bomAssyMasterInfo;
    }

    resetModel() {
        this.bomAssyMasterInfo = new BomAssyMasterModel();
    }

    public listBomAssyMasterAll() {
        return new Promise<BomAssyMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public getBomAssyMasterByID(bomAssyId: any) {
        return new Promise<BomAssyMasterModel>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom/${bomAssyId}`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve();
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public searchBomMaster(bomNo: string, bizUnitId: number, itemizedCd: string, status: number, parentName: string) {
        return new Promise<BomAssyMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom/search?bomNo=${bomNo}&bizUnitId=${bizUnitId}&itemizedCd=${itemizedCd}&status=${status}&parentName=${parentName}`).subscribe(data => {
                resolve(data.data);
            });
        });
    }

    public listProcessFlowUKID() {
        return new Promise<any[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_process_route`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public listParentItem(parentId: string) {
        return new Promise<BomAssyMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom/assy_items?parentId=${parentId}`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public insertBomAssy(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_bom`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateBomAssy(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_bom`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteItem(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_bom/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}