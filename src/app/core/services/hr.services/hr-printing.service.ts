import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrPrintingModel, HrPrintingCardModel } from '@app/core/models/hr/hr-printing.model';
import { NotificationService } from '../notification.service';

@Injectable({
    providedIn: 'root'
})
export class HrPrintingService {
    private HrPrintingModel: HrPrintingModel
    constructor(private api: CRMSolutionApiService,private notificationService: NotificationService ) {
        this.HrPrintingModel = new HrPrintingModel();

    }
    getModel(): HrPrintingModel {
        return this.HrPrintingModel;
    }

    public insertHrPrinting(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("employee/printing/save", model).subscribe(data => {
                resolve(data);
            }); 
        });
    }

    public HrCardPrinting(departId, hrId, hiredFrom, hiredTo) {
        return new Promise<HrPrintingCardModel[]>((resolve, reject) => {
            this.api.get(`employee/printing/card?departId=${departId}&hrId=${hrId}&hiredFrom=${hiredFrom}&hiredTo=${hiredTo}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showError(data.error.message)
                    resolve([]);
                }
                resolve(data);
            }); 
        });
    }
}

