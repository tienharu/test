import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrContractInfoModel } from '@app/core/models/hr/hr-contract-info.model';

@Injectable({
    providedIn: 'root'
})
export class HrContractInfoService {
    private hrContractInfoModel: HrContractInfoModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrContractInfoModel = new HrContractInfoModel();
    }
    getModel(): HrContractInfoModel {
        return this.hrContractInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrContractInfoModel) {
        this.hrContractInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrContractInfoModel = new HrContractInfoModel();
    }
    public insertHrContract(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/contract/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrContract(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/contract/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listContract(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/contract/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
