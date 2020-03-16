import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '../notification.service';
import { HrSpecialSalaryDetailModel } from '@app/core/models/hr/hr-special-salary-detail.model';

@Injectable({
    providedIn: 'root'
})
export class HrSpecialSalaryDetailService {
    private HrSpecialSalaryDetailModel: HrSpecialSalaryDetailModel;

    constructor(private api: CRMSolutionApiService,private notificationService: NotificationService) {
        this.HrSpecialSalaryDetailModel = new HrSpecialSalaryDetailModel();
    }
    getModel(): HrSpecialSalaryDetailModel {
        return this.HrSpecialSalaryDetailModel;
    }

    storeTemporaryModel(systemMenuInfo: HrSpecialSalaryDetailModel) {
        this.HrSpecialSalaryDetailModel = systemMenuInfo;
    }

    resetModel() {
        this.HrSpecialSalaryDetailModel = new HrSpecialSalaryDetailModel();
    }

    //
    public insertHrSpecialSalaryDetail(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("spsalarydetail/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public DeleteHrSpecialSalaryDetail(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("spsalarydetail/delete", model).subscribe(data => {
              resolve(data);
            });
          });
    }
    public listHrSpecialSalaryDetail(companyId,orgId,year,month,specialPayItemId) {
        return new Promise<any>((resolve, reject) => {
          this.api.get(`spsalarydetail/list?companyId=${companyId}&orgId=${orgId}&year=${year}&month=${month}&specialPayItemId=${specialPayItemId}`).subscribe(data => {
            if(data.error){
                this.notificationService.showMessage('error',data.error.message)
                resolve([]);
                return;
            }
            resolve(data);
          });
        });
    }
}
