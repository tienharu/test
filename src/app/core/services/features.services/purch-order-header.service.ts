import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { PurchOrderHeaderModel } from "@app/core/models/purch-order-header.model";
import { CustomerMaterialModel } from "@app/core/models/customer-material.model";

@Injectable()
export class PurchOrderHeaderService {
    private purchOrderHeaderInfo: PurchOrderHeaderModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.purchOrderHeaderInfo = new PurchOrderHeaderModel();
    }

    getModel(): PurchOrderHeaderModel {
        return this.purchOrderHeaderInfo;
    }

    resetModel() {
        this.purchOrderHeaderInfo = new PurchOrderHeaderModel();
    }

    public listPurchOrderHeaderAll() {
        return new Promise<PurchOrderHeaderModel[]>((resolve, reject) => {
            this.api.get(`api/v1/order/purch-order-header`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public searchWoNo(buyer: any, styleNo: any, woNo: any) {
        return new Promise<any> ((resolve, reject) => {
            this.api.get(`api/v1/order/purch-order-header/search-wo?buyer=${buyer}&styleNo=${styleNo}&woNo=${woNo}`).subscribe(data => {
                if (data.result.length < 1) {
                    this.notificationService.showMessage("error", "Data not found!");
                    resolve([]);
                    return;
                } else {
                    this.notificationService.showMessage("success", data.result.length + " Data had found!");
                    resolve(data.result);
                }
            });
        });
    }

    public searchPurchOrderHeader(searchInfo: any) {
        return new Promise<any> (resolve => {
            this.api.post(`api/v1/order/purch-order-header/search-poheader`, searchInfo).subscribe(data => {
                if (!data.result.success) {
                    this.notificationService.showMessage("error", "Data not found!");
                    resolve([]);
                } else {
                    this.notificationService.showMessage("success", data.result.data.length + " data found!");
                    resolve(data.result.data);
                }
            })
        })
    }

    public getSelectedWorkOrder(woNoList: any) {
        return new Promise<any> ((resolve, reject) => {
            this.api.get(`api/v1/order/purch-order-header/get-material?wolist=${woNoList}`).subscribe(data => {
                if (!data.result || data.result.length < 1) {
                    this.notificationService.showMessage("error", "Data not found!");
                }
                resolve(data.result);
            });
        });
    }

    public insertPurchOrder(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/purch-order-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updatePurchOrder(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/purch-order-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deletePurchOrder(poSheetNo: any) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/order/purch-order-header/${poSheetNo}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getCustomer() {
        return new Promise<any[]>((resolve, reject) => {
            this.api.get(`customer/suppliers`).subscribe(data => {     
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public getMaterialNameById(materialId: any) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/mas_material/${materialId}`).subscribe(data => {
                resolve(data.data);
            });
        });
    }

    public getColorNameByID(colorId: any) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/mas-style-color/${colorId}`).subscribe(data => {
                resolve(data.data);
            });
        });
    }
}