import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { GlobalMasterModel } from "@app/core/models/global_master.model";
import { RoutingMasterModel } from "@app/core/models/routing-master.model";
import { SaleOrderCreateModel } from "@app/core/models/sale-order-create.model";
import { ItemMasterModel } from "@app/core/models/item-master.model";
import { SaleOrderCreateDetailModel } from "@app/core/models/sale-order-create-detail.model";

@Injectable()
export class SaleOrderCreateService {
    private SaleOrderCreateInfo: SaleOrderCreateModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.SaleOrderCreateInfo = new SaleOrderCreateModel();
    }

    getModel(): SaleOrderCreateModel {
        return this.SaleOrderCreateInfo;
    }

    resetModel() {
        this.SaleOrderCreateInfo = new SaleOrderCreateModel();
    }

    public listSaleOrderCreaterAll() {
        return new Promise<SaleOrderCreateModel[]>((resolve, reject) => {
            this.api.get(`api/v1/sales_order`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    public getAllListTableDetail() {
        return new Promise<SaleOrderCreateDetailModel[]>((resolve, reject) => {
            this.api.get(`api/v1/sales_order_detail`).subscribe(data => {
                
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
    //Table Header
    public insertSaleOrderCreate(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/sales_order`, model).subscribe(data => {
                resolve(data);
                console.log("Gia tri data tra ve sau Insert",data);
            });
        });
    }
    //Table-detail insert and update
    public insertSaleOrderCreateTable(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/sales_order_detail`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateSaleOrderCreate(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/sales_order`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteSaleOrderTableEachRowCreate(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/sales_order_detail/${id}`).subscribe(data => {
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
    
   
    public listItemMasterAll() {
        return new Promise<ItemMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_item`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
}