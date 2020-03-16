import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { PurchOrderWonoModel } from "@app/core/models/purch-order-wono.model";

@Injectable()
export class PurchOrderWonoService {
    private purchOrderWonoInfo: PurchOrderWonoModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.purchOrderWonoInfo = new PurchOrderWonoModel();
    }

    getModel(): PurchOrderWonoModel {
        return this.purchOrderWonoInfo;
    }

    resetModel() {
        this.purchOrderWonoInfo = new PurchOrderWonoModel();
    }

}