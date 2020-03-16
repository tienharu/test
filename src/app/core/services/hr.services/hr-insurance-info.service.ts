import { Injectable } from '@angular/core';
import { HrInsuranceInfoModel } from '@app/core/models/hr/hr-insurance-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { observable } from 'rxjs';
import { HrNewCareerModel } from '@app/core/models/hr/hr-new-career.model';
import { promise } from 'protractor';
import { resolve, reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class HrInsuranceInfoService {
  private hrInsuranceInfoModel: HrInsuranceInfoModel;

  constructor(private api: CRMSolutionApiService) {
    this.hrInsuranceInfoModel = new HrInsuranceInfoModel();
  }

  getModel(): HrInsuranceInfoModel {
    return this.hrInsuranceInfoModel;
  }

  storeTemporaryModel(systemMenuInfo: HrInsuranceInfoModel) {
    this.hrInsuranceInfoModel = systemMenuInfo;
  }

  resetModel() {
    this.hrInsuranceInfoModel = new HrInsuranceInfoModel();
  }
  public insertHrInsuranceInfo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("employee/insurance/save", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public DeleteHrInsuranceInfo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("employee/insurance/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  
  public listInsurance(company_id, hr_id) {
    if (company_id <= 0) {
      return new Promise<HrInsuranceInfoModel[]>((resolve, reject) => {
        resolve([]);
      });
    }
    return new Promise<HrInsuranceInfoModel[]>((resolve, reject) => {
      this.api.get("employee/insurance/list?companyId=" + company_id + '&hrId=' + hr_id).subscribe(data => {
        if (!data.total && !data.data) {
          resolve([]);
        }
        resolve(data.data);
      });
    });
  }
}
