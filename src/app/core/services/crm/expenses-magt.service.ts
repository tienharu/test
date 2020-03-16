import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '../notification.service';
import { CrmMasServiceCategoryModel, CrmMasServiceItemModel } from '@app/core/models/crm/setting-item.model';
import { ExpensesModel, ExpensesContactorModel } from '@app/core/models/crm/expenses-magt.model';


@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  ExpensesModel: ExpensesModel

  constructor(private api: CRMSolutionApiService, private notificationService: NotificationService, ) {

  }
  public initModel(company_id): ExpensesModel {
    this.ExpensesModel = new ExpensesModel();
    this.ExpensesModel.company_id = company_id
    return this.ExpensesModel
  }
  public getList(companyId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/crm-order-magt/expenses/get-list?companyId=${companyId}`).subscribe(data => {
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
      this.api.post(`/crm-order-magt/expenses/save`, model).subscribe(data => {
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
      this.api.post(`/crm-order-magt/expenses/delete`, model).subscribe(data => {
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
export class ExpensesContactorService {
  ExpensesContactorModel: ExpensesContactorModel

  constructor(private api: CRMSolutionApiService, private notificationService: NotificationService, ) {

  }
  public initModel(company_id): ExpensesContactorModel {
    this.ExpensesContactorModel = new ExpensesContactorModel();
    this.ExpensesContactorModel.company_id = company_id
    return this.ExpensesContactorModel
  }
  // public getList(companyId) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.api.get(`/crm-order-magt/expenses/get-list?companyId=${companyId}`).subscribe(data => {
  //       if (data.error) {
  //         this.notificationService.showMessage("error", data.error.message);
  //         resolve([]);
  //         return;
  //       }
  //       resolve(data.data);
  //     });
  //   });
  // }
  public addOrUpdate(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/crm-order-magt/expenses/save`, model).subscribe(data => {
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
      this.api.post(`/crm-order-magt/expenses/delete`, model).subscribe(data => {
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


