import { SystemMenuModel } from "@app/core/models/system-menu.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { SecurityItemModel } from "@app/core/models/security-item.model";

@Injectable({
    providedIn: 'root'
})
export class SecurityItemService {
    private systemMenuInfo: SystemMenuModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.systemMenuInfo = new SystemMenuModel();
    }
    public listSecurityItem(companyId) {
        return new Promise<any[]>((resolve, reject) => {
            this.api
                .get(`/security-item/get-list?companyId=${companyId}`)
                .subscribe(data => {
                    if (data.error) {
                        this.notificationService.showMessage("error", data.error.message);
                        resolve([]);
                        return;
                    }
                    resolve(data.data);
                });
        });
    }
    public addOrUpdateSecurityItem(model) {
        return new Promise<any>((resolve, reject) => {
            this.api
                .post(`/security-item/save`, model)
                .subscribe(data => {
                    if (data.error) {
                        this.notificationService.showMessage("error", data.error.message);
                        resolve();
                        return;
                    }
                    resolve(data);
                });
        });
    }
    public deleteSecurityItem(model) {
        return new Promise<any>((resolve, reject) => {
            this.api
                .post(`/security-item/delete`, model)
                .subscribe(data => {
                    if (data.error) {
                        this.notificationService.showMessage("error", data.error.message);
                        resolve();
                        return;
                    }
                    resolve(data);
                });
        });
    }
}