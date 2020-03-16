import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrMaternityInfoModel } from '@app/core/models/hr/hr-maternity-info.model';


@Injectable({
    providedIn: 'root'
})
export class HrMaternityInfoService {

    constructor(private api: CRMSolutionApiService) {
    }
    

    public insertHrMaternityInfo(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("employee/maternity/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public DeleteHrMaternityfo(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("employee/maternity/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getMaternityDetail(companyId, hrId) {
        if (companyId <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve({});
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get(`employee/maternity/detail?companyid=${companyId}&hrId=${hrId}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}

