import { Injectable } from '@angular/core';
import { HrFamilyInfoModel } from '@app/core/models/hr/hr-Family-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrFamilyInfoService {
    private hrFamilyInfoModel: HrFamilyInfoModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrFamilyInfoModel = new HrFamilyInfoModel();
    }
    getModel(): HrFamilyInfoModel {
        return this.hrFamilyInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrFamilyInfoModel) {
        this.hrFamilyInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrFamilyInfoModel = new HrFamilyInfoModel();
    }
    public insertHrFamilyInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/family/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrFamilyInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/family/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listFamily(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/family/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
    
}
