import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { PurchOrderDetailModel } from "@app/core/models/purch-order-detail.model";

@Injectable()
export class PurchOrderDetailService {
    private purchOrderDetailInfo: PurchOrderDetailModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.purchOrderDetailInfo = new PurchOrderDetailModel();
    }

    getModel(): PurchOrderDetailModel {
        return this.purchOrderDetailInfo;
    }

    resetModel() {
        this.purchOrderDetailInfo = new PurchOrderDetailModel();
    }

    public getPurchOrderDetailByPoSheetNo(poSheetNo: any) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/order/purch-order-header/${poSheetNo}`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            })
        })
    } 

}