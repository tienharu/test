import { Injectable } from '@angular/core';
import { HrLastCareerModel } from '@app/core/models/hr/hr-last-career.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrLastCareerService {
    private hrLastCareerModel: HrLastCareerModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrLastCareerModel = new HrLastCareerModel();
    }
    getModel(): HrLastCareerModel {
        return this.hrLastCareerModel;
    }

    storeTemporaryModel(systemMenuInfo: HrLastCareerModel) {
        this.hrLastCareerModel = systemMenuInfo;
    }

    resetModel() {
        this.hrLastCareerModel = new HrLastCareerModel();
    }
    public insertHrLastCare(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/Career/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrLastCare(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/Career/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listlastCare(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/Career/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
