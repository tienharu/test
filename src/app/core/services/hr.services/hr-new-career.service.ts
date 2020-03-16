import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrNewCareerModel } from '@app/core/models/hr/hr-new-career.model';

@Injectable({
    providedIn: 'root'
})
export class HrNewCareerService {
    private hrNewCareerModel: HrNewCareerModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrNewCareerModel = new HrNewCareerModel();
    }
    getModel(): HrNewCareerModel {
        return this.hrNewCareerModel;
    }

    storeTemporaryModel(systemMenuInfo: HrNewCareerModel) {
        this.hrNewCareerModel = systemMenuInfo;
    }

    resetModel() {
        this.hrNewCareerModel = new HrNewCareerModel();
    }
    public insertHrPathCare(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/Career/save/pathcareer", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrPathCare(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/Career/delete/pathcareer", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listPathCare(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/Career/list/pathcareer?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
