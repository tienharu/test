import { Injectable } from '@angular/core';
import { HrAppraisalInfoModel } from '@app/core/models/hr/hr-Appraisal-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrAppraisalInfoService {
    private hrAppraisalInfoModel: HrAppraisalInfoModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrAppraisalInfoModel = new HrAppraisalInfoModel();
    }
    getModel(): HrAppraisalInfoModel {
        return this.hrAppraisalInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrAppraisalInfoModel) {
        this.hrAppraisalInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrAppraisalInfoModel = new HrAppraisalInfoModel();
    }
    public insertHrAppraisalInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/appraisal/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrAppraisalInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/appraisal/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listAppraisal(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/appraisal/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
