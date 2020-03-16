import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { DutyTypeModel } from '../../models/hr/hr-mas-duty-type.model';

@Injectable()
export class DutyTypeService {
    model: DutyTypeModel;
    constructor(private api: CRMSolutionApiService) {
        this.model = new DutyTypeModel();
    }

    storeTemporaryModel(model: DutyTypeModel) {
        this.model = model;
    }

    getModel(): DutyTypeModel {
        return this.model;
    }

    resetModel() {
        this.model = new DutyTypeModel();
    }

    public GetPayrollItems() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("dutytype/payrollitems").subscribe(data => {
                resolve(data);
                return;
            });
        });
    }

    public getDutyType() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("dutytype/common").subscribe(data => {
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

    public getDutyTypes() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("dutytype/list").subscribe(data => {
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

    public saveDutyTypes(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("dutytype/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public delete(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("dutytype/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }
}