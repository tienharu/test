import { Injectable } from '@angular/core';
import { HrAcademicInfoModel } from '@app/core/models/hr/hr-Academic-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrAcademicInfoService {
    private hrAcademicInfoModel: HrAcademicInfoModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrAcademicInfoModel = new HrAcademicInfoModel();
    }
    getModel(): HrAcademicInfoModel {
        return this.hrAcademicInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrAcademicInfoModel) {
        this.hrAcademicInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrAcademicInfoModel = new HrAcademicInfoModel();
    }
    public insertHrAcademicInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/academy/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrAcademicInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/academy/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listAcademic(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/academy/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
