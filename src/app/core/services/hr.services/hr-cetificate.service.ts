import { Injectable } from '@angular/core';
import { HrCetificateModel } from '@app/core/models/hr/hr-cetificate.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrCetificateService {
    private hrCetificateModel: HrCetificateModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrCetificateModel = new HrCetificateModel();
    }
    getModel(): HrCetificateModel {
        return this.hrCetificateModel;
    }

    storeTemporaryModel(systemMenuInfo: HrCetificateModel) {
        this.hrCetificateModel = systemMenuInfo;
    }

    resetModel() {
        this.hrCetificateModel = new HrCetificateModel();
    }
    public insertHrCertificate(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/cetificate/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrCertificate(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/cetificate/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listCertificate(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/cetificate/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
