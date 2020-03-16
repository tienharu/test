import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { BomComponentMasterModel, BomComponentItem } from "@app/core/models/bom-component-master.model";
import { Observable, Subject } from "rxjs";

@Injectable()
export class BomComponentMasterService {
    private bomComponentMasterInfo: BomComponentMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.bomComponentMasterInfo = new BomComponentMasterModel();
    }

    getModel(): BomComponentMasterModel {
        return this.bomComponentMasterInfo;
    }

    resetModel() {
        this.bomComponentMasterInfo = new BomComponentMasterModel();
    }

    public listBomComponentMasterAll() {
        return new Promise<BomComponentItem[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom_component`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public listBomComponentParent(id) {
        return new Promise<BomComponentMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom/${id}/components`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public getBomComponentCopy(bomId: string, assyItemId: string) {
        return new Promise<any[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_bom_component/copy_assy_items?bomId=${bomId}&assyItemId=${assyItemId}`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public deleteBomComponent(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_bom_component/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}