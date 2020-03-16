import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { DueOutMaterialModel} from '@app/core/models/due-out-material-model';
import { GeneralMasterModel } from "@app/core/models/general_master.model";

@Injectable()
export class DueOutMaterialService {
    private dueOutMaterialModel: DueOutMaterialModel;

    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.dueOutMaterialModel = new DueOutMaterialModel();
    }

    getDueOutMaterialModel(): DueOutMaterialModel {
        return this.dueOutMaterialModel;
    }

    storeDueOutMaterialModel(DueOutMaterialModel: DueOutMaterialModel) {
        this.dueOutMaterialModel = DueOutMaterialModel;
    }

    resetDueOutMaterialModel() {
        this.dueOutMaterialModel = new DueOutMaterialModel();
    }

    //------------------- Work Order Master-----------------------------------
    public search(cri) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/due-out-material/search`, cri).subscribe(rs => {
                resolve(rs);
                return;
            });
        });
    }

    public getAllDueOutMaterial() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/due-out-material`)
                .subscribe(data => {resolve(data.data);
                    return;
                });
        });
    }

    public getWorkOrderById(woNo, stepSeq) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/due-out-material/woNo/${woNo}/stepSeq/${stepSeq}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getDueOutMaterialDetail(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/iv-material-wo-detail/search`,model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertDueOutMaterialHeader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/iv-material-wo-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public insertDueOutMaterialDetail(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/iv-material-wo-detail`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateDueOutMaterialHeader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/iv-material-wo-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public deleteDueOutMaterialHeader(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/iv-material-wo-header/del`,model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public deleteDueOutMaterialDetail(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/iv-material-wo-detail/del`,model).subscribe(data => {
                resolve(data);
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
    public currentStock() {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/iv-stock/search`,{}).subscribe(data => {
                resolve(data);
            });
        });
    }

}
