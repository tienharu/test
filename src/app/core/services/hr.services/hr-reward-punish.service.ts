import { Injectable } from '@angular/core';
import { HrRewardPunishModel } from '@app/core/models/hr/hr-reward-punish.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';

@Injectable({
    providedIn: 'root'
})
export class HrRewardPunishInfoService {
    private hrRewardPunishInfoModel: HrRewardPunishModel;

    constructor(private api: CRMSolutionApiService) {
        this.hrRewardPunishInfoModel = new HrRewardPunishModel();
    }
    getModel(): HrRewardPunishModel {
        return this.hrRewardPunishInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrRewardPunishModel) {
        this.hrRewardPunishInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrRewardPunishInfoModel = new HrRewardPunishModel();
    }
    public insertHrRewardPunishInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/reward/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteHrRewardPunishInfo(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/reward/delete", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public listRewardPunish(company_id, hr_id) {
      if(company_id<=0){
        return new Promise<any>((resolve, reject) => {
          resolve([]);
        });
      }
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/reward/list?companyId="+company_id+'&hrId='+hr_id).subscribe(data => {
            if(!data.total && !data.data){
              resolve([]);
            }
            resolve(data.data);
          });
        });
    }
}
