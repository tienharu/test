import { Injectable } from '@angular/core';
import { CompanyCfModel } from '../models/company-cf.model';
import { CRMSolutionApiService } from '../api/crm-solution-api.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyFcService {
  private companyCfInfo: CompanyCfModel
  constructor(private api: CRMSolutionApiService,
    private notificationService: NotificationService) {
    this.companyCfInfo = new CompanyCfModel();
  }

  getModel(): CompanyCfModel {
    return this.companyCfInfo
  }

  storeTemporaryModel(companyCfInfo: CompanyCfModel) {
    this.companyCfInfo = companyCfInfo;
  }

  resetModel() {
    this.companyCfInfo = new CompanyCfModel();
  }

  

  public listCompanyCf() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-scf-company`).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          resolve([]);
          return;
        }
        if (!data.success) {
          this.notificationService.showMessage("error", data.data.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      });
    });
  }

  public deleteCompanyCf(id) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete("mas-scf-company/" + `${id}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public insertCompanyCf(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("mas-scf-company/", model).subscribe(data => {
        console.log("data insert",data)
        resolve(data);
      });
    });
  }
  public updateCompanyCf(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-scf-company/", model).subscribe(data => {
        console.log("data update",data)
        resolve(data);
      });
    });
  }

  public settingCompanyCf(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-scf-company/setting", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public spaceCompanyCf(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-scf-company/space", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public copyCompanyCf(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-scf-company/copy", model).subscribe(data => {
        console.log(data);
        resolve(data);
      });
    });
  }
}
