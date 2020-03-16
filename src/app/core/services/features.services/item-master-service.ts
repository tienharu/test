import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { ItemMasterModel } from "@app/core/models/item-master.model";

@Injectable()
export class ItemMasterService {
    private itemMasterInfo: ItemMasterModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.itemMasterInfo = new ItemMasterModel();
    }

    getModel(): ItemMasterModel {
        return this.itemMasterInfo;
    }

    resetModel() {
        this.itemMasterInfo = new ItemMasterModel();
    }

    public listItemMasterAll() {
        return new Promise<ItemMasterModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_item`).subscribe(data => {
                console.log("list Item All", data);
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public insertItem(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_item`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateItem(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_item`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteItem(id: string) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_item/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}