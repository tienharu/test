import { SystemMenuModel } from "@app/core/models/system-menu.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";

@Injectable()
export class SystemMenuService {
    private systemMenuInfo: SystemMenuModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.systemMenuInfo = new SystemMenuModel();
    }
    public listMenuOfCompany(companyId) {
        return new Promise<any[]>((resolve, reject) => {
          this.api
            .get(`/menu/list/by-company?companyId=${companyId}`)
            .subscribe(data => {
              if (!data.success) {
                this.notificationService.showMessage("error", data.data.message);
                resolve([]);
                return;
              }
              resolve(data.data);
            });
        });
      }

    getModel(): SystemMenuModel {
        return this.systemMenuInfo;
    }

    storeTemporaryModel(systemMenuInfo: SystemMenuModel) {
        this.systemMenuInfo = systemMenuInfo;
    }

    resetModel() {
        this.systemMenuInfo = new SystemMenuModel();
    }
}