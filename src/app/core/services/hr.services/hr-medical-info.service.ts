import { Injectable } from '@angular/core';
import { HrMedicalInfoModel } from '@app/core/models/hr/hr-Medical-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrMedicalInfoService {
    private hrMedicalInfoModel: HrMedicalInfoModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrMedicalInfoModel = new HrMedicalInfoModel();
    }
    getModel(): HrMedicalInfoModel {
        return this.hrMedicalInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrMedicalInfoModel) {
        this.hrMedicalInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrMedicalInfoModel = new HrMedicalInfoModel();
    }
    public insertHrMedicalInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/medical/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrMedicalInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/medical/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listMedical(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/medical/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
