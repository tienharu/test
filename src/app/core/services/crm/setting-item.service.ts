import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '../notification.service';
import { CrmMasServiceCategoryModel, CrmMasServiceItemModel } from '@app/core/models/crm/setting-item.model';


@Injectable({
  providedIn: 'root'
})
export class CrmMasServiceCategoryService {
  crmMasServiceCategoyModel: CrmMasServiceCategoryModel

  constructor(private api: CRMSolutionApiService, private notificationService: NotificationService, ) {

  }
  public initModel(company_id): CrmMasServiceCategoryModel {
    this.crmMasServiceCategoyModel = new CrmMasServiceCategoryModel();
    this.crmMasServiceCategoyModel.company_id = company_id
    return this.crmMasServiceCategoyModel
  }
  public getList(companyId) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.get(`/crm-mas-service/category/get-list?companyId=${companyId}`).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      });
    });
  }
  public addOrUpdate(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/crm-mas-service/category/save`, model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject();
          return;
        }
        resolve(data);
      });
    });
  }

  public delete(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/crm-mas-service/category/delete`, model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject();
          return;
        }
        resolve(data);
      });
    });
  }

}

@Injectable({
  providedIn: 'root'
})
export class CrmMasServiceItemService {
  crmMasServiceItemModel: CrmMasServiceItemModel

  constructor(private api: CRMSolutionApiService, private notificationService: NotificationService, ) {
  }
  public initModel(company_id): CrmMasServiceItemModel {
    this.crmMasServiceItemModel = new CrmMasServiceItemModel();
    this.crmMasServiceItemModel.company_id = company_id
    return this.crmMasServiceItemModel
  }
  public getList(companyId, crmServiceCateId) {
    return new Promise<any[]>((resolve, reject) => {
      this.api
        .get(`/crm-mas-service/item/get-list?companyId=${companyId}&crmServiceCateId=${crmServiceCateId}`)
        .subscribe(data => {
          if (data.error) {
            this.notificationService.showMessage("error", data.error.message);
            resolve([]);
            return;
          }
          resolve(data.data);
        });
    });
  }

  public addOrUpdate(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/crm-mas-service/item/save`, model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject();
          return;
        }
        resolve(data);
      });
    });
  }

  public delete(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/crm-mas-service/item/delete`, model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject();
          return;
        }
        resolve(data);
      });
    });
  }
}

