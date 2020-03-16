import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '../api/crm-solution-api.service';
import { NotificationService } from './notification.service';
import { PurchasingHeaderModel, PurchasingDetailtModel } from '../models/purchasing-header.model';

@Injectable({
  providedIn: 'root'
})
export class PurchasingMagtService {
  private purchasingHeaderModel: PurchasingHeaderModel
  constructor(private api: CRMSolutionApiService,
    private notificationService: NotificationService) { this.purchasingHeaderModel = new PurchasingHeaderModel() }

  getModel(): PurchasingHeaderModel {
    return this.purchasingHeaderModel
  }

  storeTemporaryModel(PurchasingHeaderModel: PurchasingHeaderModel) {
    this.purchasingHeaderModel = PurchasingHeaderModel;
  }

  resetModel() {
    return this.purchasingHeaderModel = new PurchasingHeaderModel();
  }

  public getPurchasingById(id) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`api/v1/order/purch-header/${id}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public insertPurchasingHeader(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("api/v1/order/purch-header", model).subscribe(data => {
        console.log("data", data)
        resolve(data);
      });
    });
  }
  public updatePurchasingHeader(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("api/v1/order/purch-header", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public deletePurchasingHeader(purchNo) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete("api/v1/order/purch-header/id=" + `${purchNo}`).subscribe(data => {
        resolve(data);
      });
    });
  }

  public deletePurchasingDetail(purchNo, materialCd) {
    return new Promise<any>((resolve, reject) => {
      this.api.delete("api/v1/order/purch-header/purchNo=" + `${purchNo}` + '&materialCd=' + `${materialCd}`).subscribe(data => {
        resolve(data);
      });
    });
  }


  public listSuppliers() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`customer/suppliers`).subscribe(data => {
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

  public listPoSheet() {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`api/v1/order/purch-order-header`).subscribe(data => {

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


  public listSearchPurchNo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`api/v1/order/purch-header/search-po`, model).subscribe(data => {

        resolve(data);
      });
    });
  }

  public getPurchasingDetailByPoSheetNo(poSheetNo: any) {
    return new Promise<PurchasingDetailtModel[]>((resolve, reject) => {
      this.api.get(``).subscribe(data => {
        if (!data.success) {
          this.notificationService.showMessage("error", data.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      })
    })
  }
}
