import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '../notification.service';
import { HrSpecialSalaryModel } from '@app/core/models/hr/hr-special-salary.model';

@Injectable({
    providedIn: 'root'
})
export class HrSpecialSalaryService {
    private HrSpecialSalaryModel: HrSpecialSalaryModel;

    constructor(private api: CRMSolutionApiService,private notificationService: NotificationService) {
        this.HrSpecialSalaryModel = new HrSpecialSalaryModel();
    }
    getModel(): HrSpecialSalaryModel {
        return this.HrSpecialSalaryModel;
    }

    storeTemporaryModel(systemMenuInfo: HrSpecialSalaryModel) {
        this.HrSpecialSalaryModel = systemMenuInfo;
    }

    resetModel() {
        this.HrSpecialSalaryModel = new HrSpecialSalaryModel();
    }

    //
    public insertHrSpecialSalary(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("specialsalary/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public DeleteHrSpecialSalary(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("specialsalary/delete", model).subscribe(data => {
              resolve(data);
            });
          });
    }
    public listHrSpecialSalary(companyId) {
        return new Promise<any>((resolve, reject) => {
          this.api.get(`specialsalary/list?companyId=${companyId}`).subscribe(data => {
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
