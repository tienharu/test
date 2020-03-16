import { Injectable } from '@angular/core';
import { HrTraningInfoModel } from '@app/core/models/hr/hr-Traning-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from "../notification.service";

@Injectable({
    providedIn: 'root'
})
export class HrTraningInfoService {
    private hrTraningInfoModel: HrTraningInfoModel;

    constructor(private api: CRMSolutionApiService, private notificationService: NotificationService) {
        this.hrTraningInfoModel = new HrTraningInfoModel();
    }
    getModel(): HrTraningInfoModel {
        return this.hrTraningInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrTraningInfoModel) {
        this.hrTraningInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrTraningInfoModel = new HrTraningInfoModel();
    }
    public insertHrTrainingInfo(model) {
      return new Promise<any>((resolve, reject) => {
        this.api.post("employee/training/save", model).subscribe(data => {
          resolve(data);
        });
      });
    }
    public DeleteHrTrainingInfo(model) {
      return new Promise<any>((resolve, reject) => {
        this.api.post("employee/training/delete", model).subscribe(data => {
          resolve(data);
        });
      });
    }
  public listTraining(company_id, hr_id) {
    if(company_id<=0){
      return new Promise<any>((resolve, reject) => {
        resolve([]);
      });
    }
      return new Promise<any>((resolve, reject) => {
        this.api.get("employee/training/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
          if(!data.total && !data.data){
            resolve([]);
          }
          resolve(data.data);
        });
      });
  }

}
