import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { PayrollItemModel } from '@app/core/models/hr/hr-payroll-item.model';

@Injectable()
export class PayrollItemService {
    model: PayrollItemModel;
    constructor(private api: CRMSolutionApiService) {
        this.model = new PayrollItemModel();
    }

    storeTemporaryModel(model: PayrollItemModel) {
        this.model = model;
    }

    getModel(): PayrollItemModel {
        return this.model;
    }

    resetModel() {
        this.model = new PayrollItemModel();
    }

    public getMappingPayrollItems() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/item/mapping").subscribe(data => {
                if (data.success) {
                    resolve(data);
                    return;
                }
                else {
                    resolve(data);
                    return;
                }
            });
        });
    }

    public getPayrollItems() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/item/list").subscribe(data => {
                if (data.success) {
                    resolve(data);
                    return;
                }
                else {
                    resolve(data);
                    return;
                }
            });
        });
    }

    public savePayrollItems(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("payroll/item/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public delete(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("payroll/item/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }
}