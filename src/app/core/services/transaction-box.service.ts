import { Injectable } from '@angular/core';
import { TransactionBoxModel } from '../models/transaction-box.model';
import { CRMSolutionApiService } from '../api/crm-solution-api.service';
import { NotificationService } from './notification.service';
import { SystemMenuModel } from '../models/system-menu.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionBoxService {
  private tranSactionModel: TransactionBoxModel
  constructor(private api: CRMSolutionApiService,
    private notificationService: NotificationService) { }

  getModel(): TransactionBoxModel {
    return this.tranSactionModel
  }

  storeTemporaryModel(tranSactionModel: TransactionBoxModel) {
    this.tranSactionModel = tranSactionModel;
  }

  resetModel() {
    this.tranSactionModel = new TransactionBoxModel();
  }

  public listTranSaction() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-transbox`).subscribe(data => {
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

  public GetById(id) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-transbox/${id}`).subscribe(data => {
        resolve(data);
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

  public listApprovalLine() {
    return new Promise<any[]>((resolve, reject) => {
      this.api.get(`/mas-approval-line`).subscribe(data => {
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

  public deleteTranSaction(id) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete("mas-transbox/" + `${id}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public insertTranSaction(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("mas-transbox/", model).subscribe(data => {
        console.log("data", data);
        resolve(data);
      });
    });
  }
  public updateTranSaction(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-transbox/", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  //======================================================
  public getListByTransId(transId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-transbox-cd/transbox/${transId}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public getTransCodeBoxBudget(transId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-transbox-cd/budget`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public getTransCodeBoxCompanyAccount(transId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-transbox-cd/companyAcct`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public getTransFinancialCodeSetting(transId, transSeq) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-transbox-cd/transbox/${transId}/transSeq/${transSeq}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public insertTransFinancialCodeSetting(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`mas-transbox-cd`, model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public updateTransFinancialCodeSetting(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put(`mas-transbox-cd`, model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public deleteTransFinancialCodeSetting(transId, transSeq) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete(`mas-transbox-cd/transbox/${transId}/transSeq/${transSeq}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public getBudgetCodeList() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`mas-budget-cd`).subscribe(data => {
        resolve(data);
        return;
      });
    });
  }

  // public getBudgetCodeList() {
  //   return new Promise<any>((resolve, reject) => {
  //     this.api.get(`mas-budget-cd`)
  //       .subscribe(data => {
  //         resolve(data);
  //         return;
  //       });
  //   });
  // }
}
