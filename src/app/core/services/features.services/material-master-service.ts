import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { MaterialMasterModel } from "@app/core/models/material-master-model";

@Injectable()
export class MaterialMasterService {
    private materialMasterInfo: MaterialMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.materialMasterInfo = new MaterialMasterModel();
    }

    getModel(): MaterialMasterModel {
        return this.materialMasterInfo;
    }

    resetModel() {
        this.materialMasterInfo = new MaterialMasterModel();
    }

    public listMaterialMasterAll() {
        return new Promise<MaterialMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_material`).subscribe(data => {
                console.log("list Material All", data);
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public insertMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_material`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_material`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteMaterial(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_material/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}