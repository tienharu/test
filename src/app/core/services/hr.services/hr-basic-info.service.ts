import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrBasicInfoModel } from '@app/core/models/hr/hr-basic-info.model';

@Injectable({
    providedIn: 'root'
})
export class HrBasicInfoService {
    private HrBasicInfoModel: HrBasicInfoModel;

    constructor(private api: CRMSolutionApiService,) {
        this.HrBasicInfoModel = new HrBasicInfoModel();
    }
    getModel(): HrBasicInfoModel {
        return this.HrBasicInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrBasicInfoModel) {
        this.HrBasicInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.HrBasicInfoModel = new HrBasicInfoModel();
    }
    public insertHrBasicInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/basic/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrBasicInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/basic/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listBasic(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/basic/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
