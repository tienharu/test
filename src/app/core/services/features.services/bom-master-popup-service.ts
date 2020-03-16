import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { BomAssyMasterModel, BomItem } from "@app/core/models/bom-assy-master.model";
import { ProcessFlowPathRouteModel } from "@app/core/models/process-flow-path-route-model";
import { BomComponentMasterModel } from "@app/core/models/bom-component-master.model";

@Injectable()
export class BomMasterPopupService {
    private bomItem: BomItem;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.bomItem = new BomItem();
    }

    getModel(): BomItem {
        return this.bomItem;
    }

    resetModel() {
        this.bomItem = new BomItem();
    }

    public getItemByCheckValue(checkValue1: string, genCd: string) {
        switch (checkValue1) {
            case "1":
            case "2":
                return new Promise<BomComponentMasterModel[]>((resolve, reject) => {
                    this.api.get(`api/v1/mas_item/itemized/${genCd}`).subscribe(data => {
                        if (!data.success) {
                            this.notificationService.showMessage("error", data.message);
                            resolve([]);
                            return;
                        }
                        resolve(data.data);
                    });
                });
        
            default:
                break;
        }
    }

    getBomItem1(itemizedGenCd, ckVal1, itemName) {
        return new Promise<BomItem[]>((resolve, reject) => {
            this.api.get(`api/v1/itemized/bom/search?itemizedCd=${itemizedGenCd}&type=${ckVal1}&name=${itemName}`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    getBomItem2(itemizedGenCd, ckVal1, itemName) {
        return new Promise<BomItem[]>((resolve, reject) => {
            this.api.get(`api/v1/itemized/bom-component/search?itemizedCd=${itemizedGenCd}&type=${ckVal1}&name=${itemName}`).subscribe(data => {
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