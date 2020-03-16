import { Injectable } from '@angular/core';
import { NotificationService } from "@app/core/services/notification.service";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { CompanyAcModel } from '../models/company-ac.model';
import { SystemMenuModel } from '../models/system-menu.model';
@Injectable({
  providedIn: 'root'
})
export class CompanyAcService {
  private companyAcInfo: CompanyAcModel;
  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) { this.companyAcInfo = new CompanyAcModel(); }

  getModel(): CompanyAcModel {
    return this.companyAcInfo;
  }

  storeTemporaryModel(companyAcInfo: CompanyAcModel) {
    this.companyAcInfo = companyAcInfo;
  }

  resetModel() {
    this.companyAcInfo = new CompanyAcModel();
  }

  public listCompanyAc(companyId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-account-company/list?companyId=`+companyId).subscribe(data => {
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

  public listSysMenu(menuId) {
    return new Promise<SystemMenuModel[]>((resolve, reject) => {
      this.api.get(`menu/level/${menuId}`).subscribe(data => {
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

  public deleteCompanyAc(id) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete("mas-account-company/id=" + `${id}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public insertCompanyAc(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("mas-account-company/", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public updateCompanyAc(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-account-company/", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public settingCompanyAc(model) {
    console.log(model);
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-account-company/setting", model).subscribe(data => {
        console.log(data)
        resolve(data);
      });
    });
  }

  public spaceCompanyAc(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-account-company/space", model).subscribe(data => {
        console.log("update data",data)
        resolve(data);
      });
    });
  }

  public copyCompanyAc(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-account-company/copy", model).subscribe(data => {
        resolve(data);
      });
    });
  }
}
