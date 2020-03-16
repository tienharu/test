import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { WorkOrderMasterModel, SearchWorkOrderModel } from '@app/core/models/work-order-master-model';
import { WorkOrderMaterialModel } from '@app/core/models/work-order-material-model';
import { WorkOrderWorkTypeModel } from '@app/core/models/work-order-work-type-model';
import { WorkOrderCSModel } from '@app/core/models/work-order-cs-model';
import { WorkOrderImageModel } from '@app/core/models/work-order-image-model';


@Injectable()
export class WorkOrderMasterService {
    private workOrderMasterModel: WorkOrderMasterModel;
    private workOrderMaterialModel: WorkOrderMaterialModel;
    private workOrderWorkTypeModel: WorkOrderWorkTypeModel;
    private workOrderCSModel: WorkOrderCSModel;
    private workOrderImageModel: WorkOrderImageModel;


    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.workOrderMasterModel = new WorkOrderMasterModel();
        this.workOrderMaterialModel = new WorkOrderMaterialModel();
        this.workOrderWorkTypeModel = new WorkOrderWorkTypeModel();
        this.workOrderCSModel = new WorkOrderCSModel();
        this.workOrderImageModel = new WorkOrderImageModel();

    }

    getWorkOrderMasterModel(): WorkOrderMasterModel {
        return this.workOrderMasterModel;
    }

    storeWorkOrderMasterModel(workOrderMasterModel: WorkOrderMasterModel) {
        this.workOrderMasterModel = workOrderMasterModel;
    }

    resetWorkOrderMasterModel() {
        this.workOrderMasterModel = new WorkOrderMasterModel();
    }

    getWorkOrderMaterialModel(): WorkOrderMaterialModel {
        return this.workOrderMaterialModel;
    }

    storeWorkOrderMaterialModel(workOrderMaterialModel: WorkOrderMaterialModel) {
        this.workOrderMaterialModel = workOrderMaterialModel;
    }

    resetWorkOrderMaterialModel() {
        this.workOrderMaterialModel = new WorkOrderMaterialModel();
    }

    getWorkOrderWorkTypeModel(): WorkOrderWorkTypeModel {
        return this.workOrderWorkTypeModel;
    }

    storeWorkOrderWorkTypeModel(workOrderWorkTypeModel: WorkOrderWorkTypeModel) {
        this.workOrderWorkTypeModel = workOrderWorkTypeModel;
    }

    resetWorkOrderWorkTypeModel() {
        this.workOrderWorkTypeModel = new WorkOrderWorkTypeModel();
    }

    getWorkOrderCSModel(): WorkOrderCSModel {
        return this.workOrderCSModel;
    }

    storeWorkOrderCSModel(workOrderCSModel: WorkOrderCSModel) {
        this.workOrderCSModel = workOrderCSModel;
    }

    resetWorkOrderCSModel() {
        this.workOrderCSModel = new WorkOrderCSModel();
    }

    getWorkOrderImageModel(): WorkOrderImageModel {
        return this.workOrderImageModel;
    }

    storeWorkOrderImageModel(workOrderImageModel: WorkOrderImageModel) {
        this.workOrderImageModel = workOrderImageModel;
    }

    resetWorkOrderImageModel() {
        this.workOrderImageModel = new WorkOrderImageModel();
    }


    //------------------- Work Order Master-----------------------------------
    public search(cri: SearchWorkOrderModel) {
        console.log(cri);
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-header/search`, cri).subscribe(rs => {
                resolve(rs);
                return;
            });
        });
    }

    public getAllWorkOrderMaster() {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/work-order-header`)
                .subscribe(data => {
                    resolve(data.data);
                    return;
                });
        });
    }

    public getWorkOrderById(woNo, stepSeq) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/work-order-header/woNo/${woNo}/stepSeq/${stepSeq}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertWorkOrder(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateWorkOrder(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/work-order-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteWorkOrder(woNo, stepSeq) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/work-order-header/woNo/${woNo}/stepSeq/${stepSeq}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Work Order Material-----------------------------------
    // public getAllWorkOrderMaterial() {
    //     return new Promise<any>((resolve, reject) => {
    //         this.api.get(`api/v1/order/work-order-material`)
    //             .subscribe(data => {
    //                 resolve(data.data);
    //                 return;
    //             });
    //     });
    // }

    public getWorkOrderMaterialById(woNo, stepSeq) {
        var cri = {
            woNo: woNo,
            stepSeq: stepSeq
        };
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-material/search`, cri).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertWorkOrderMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-material`, model).subscribe(data => {
                resolve(data);
            });
            resolve([]);
        });
    }

    public updateWorkOrderMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/work-order-material`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteWorkOrderMaterial(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/work-order-material`).subscribe(data => {
                resolve(data);
            });
        });
    }

    // public deleteWorkOrderMaterial(woNo, stepSeq) {
    //     return new Promise<any>((resolve, reject) => {
    //         this.api.delete(`api/v1/order/work-order-material/woNo/${woNo}/stepSeq/${stepSeq}`).subscribe(data => {
    //             resolve(data);
    //         });
    //     });
    // }

    //------------------- Work Type-----------------------------------
    // public getAllWorkOrderWorkType() {
    //     return new Promise<any>((resolve, reject) => {
    //         this.api.get(`api/v1/order/work-order-type`)
    //             .subscribe(data => {
    //                 resolve(data.data);
    //                 return;
    //             });
    //     });
    // }

    public getWorkOrderWorkTypeById(woNo, stepSeq) {
        var cri = {
            woNo: woNo,
            stepSeq: stepSeq
        };
        console.log(cri);
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-type/search`, cri).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertWorkOrderWorkType(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-type`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateWorkOrderWorkType(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/work-order-type`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteWorkOrderWorkType(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-type/del`, model).subscribe(data => {
                resolve(data);
            });
        });
    }


    //------------------- Work Order CS-----------------------------------
    // public getAllWorkOrderCS() {
    //     return new Promise<any>((resolve, reject) => {
    //         this.api.get(`api/v1/order/work-order-cs`)
    //             .subscribe(data => {
    //                 resolve(data.data);
    //                 return;
    //             });
    //     });
    // }

    public getWorkOrderCSById(woNo, stepSeq) {
        var cri = {
            woNo: woNo,
            stepSeq: stepSeq
        };
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-cs/search`, cri).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertWorkOrderCS(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-cs`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateWorkOrderCS(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/work-order-cs`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteWorkOrderCS(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-cs/del`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    //------------------- Work Order Image-----------------------------------
    // public getAllWorkOrderImage() {
    //     return new Promise<any>((resolve, reject) => {
    //         this.api.get(`api/v1/order/work-order-upload`)
    //             .subscribe(data => {
    //                 resolve(data.data);
    //                 return;
    //             });
    //     });
    // }

    public getWorkOrderImageById(woNo, stepSeq) {
        var cri = {
            woNo: woNo,
            stepSeq: stepSeq
        };
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-upload/search`, cri).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertWorkOrderImage(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-upload`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateWorkOrderImage(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/work-order-upload`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteWorkOrderImage(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-upload/del`, model).subscribe(data => {
                resolve(data);
            });
        });
    }
}
