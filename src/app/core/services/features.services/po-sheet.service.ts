import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { PurchOrderHeaderModel, PoSheetPopupModel } from "@app/core/models/purch-order-header.model";
import { PurchOrderDetailModel } from "@app/core/models/purch-order-detail.model";
import { PurchOrderWonoModel } from "@app/core/models/purch-order-wono.model";

@Injectable()
export class PoSheetService {
  private purchOrderHeaderModel: PurchOrderHeaderModel;
  private purchOrderDetailModel: PurchOrderDetailModel;
  private purchOrderWoNoModel: PurchOrderWonoModel;
  private purchPopup: PoSheetPopupModel;
  constructor(private api: CRMSolutionApiService,
    private notificationService: NotificationService) {
    this.purchOrderHeaderModel = new PurchOrderHeaderModel();
    this.purchOrderDetailModel = new PurchOrderDetailModel();
    this.purchOrderWoNoModel = new PurchOrderWonoModel();
    this.purchPopup = new PoSheetPopupModel();
  }

  getModel(): PoSheetPopupModel{
    return this.purchPopup;
  }

  resetModel() {
    this.purchPopup = new PoSheetPopupModel();
  }

  getPurchOrderHeaderModel(): PurchOrderHeaderModel {
    return this.purchOrderHeaderModel;
  }

  getPurchOrderDetailModell(): PurchOrderDetailModel {
      return this.purchOrderDetailModel;
  }

  getPurchOrderWonoModel(): PurchOrderWonoModel {
      return this.purchOrderWoNoModel;
  }

  storePurchOrderHeaderModel(purchOrderHeaderModel: PurchOrderHeaderModel) {
    this.purchOrderHeaderModel = purchOrderHeaderModel;
  }

  storePurchOrderDetailModell(purchOrderDetailModel: PurchOrderDetailModel) {
    this.purchOrderDetailModel = purchOrderDetailModel;
  }

  storePurchOrderWonoModel(purchOrderWoNoModel: PurchOrderWonoModel) {
    this.purchOrderWoNoModel = purchOrderWoNoModel;
  }

  resetPurchOrderHeaderModel() {
    this.purchOrderHeaderModel = new PurchOrderHeaderModel();
  }

  resetPurchOrderDetailModell() {
    this.purchOrderDetailModel = new PurchOrderDetailModel();
  }

  resetPurchOrderWonoModel() {
    this.purchOrderWoNoModel = new PurchOrderWonoModel();
  }
  // write function call api
  //------------------- Purch Order Header -------------------
  public getAllPurchOrderHeader() {
    return new Promise<any>((resolve, reject) => {
        this.api.get(`api/v1/order/purch-order-header`)
            .subscribe(data => {
                resolve(data.data);
                return;
            });
    });
  }

  public getPurchOrderHeaderById(id) {
      return new Promise<any>((resolve, reject) => {
          this.api.get(`api/v1/order/purch-order-header/${id}`).subscribe(data => {
              resolve(data);
          });
      });
  }

  public insertPurchOrderHeader(model) {
      return new Promise<any>((resolve, reject) => {
          this.api.post(`api/v1/order/purch-order-header`, model).subscribe(data => {
              resolve(data);
          });
      });
  }

  public updatePurchOrderHeader(model) {
      return new Promise<any>((resolve, reject) => {
          this.api.put(`api/v1/order/purch-order-header`, model).subscribe(data => {
              resolve(data);
          });
      });
  }

  public deletePurchOrderHeader(id) {
      return new Promise<any>((resolve, reject) => {
          this.api.delete(`api/v1/order/purch-order-header/${id}`).subscribe(data => {
              resolve(data);
          });
      });
  }


  public getPOSheetSearch(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`api/v1/order/purch-order-header/search-posheet`, model).subscribe(data => {
        resolve(data);
      });
    });
  }

  //------------------- Purch Order Detail -------------------
  public getAllPurchOrderDetail() {
    return new Promise<any>((resolve, reject) => {
        this.api.get(`api/v1/order/purch-order-detail`)
            .subscribe(data => {
                resolve(data.data);
                return;
            });
    });
  }

  public getPurchOrderDetailById(poSheetNo,transSeq) {
      return new Promise<any>((resolve, reject) => {
          this.api.get(`api/v1/order/purch-order-detail/poSheetNo=${poSheetNo}&transSeq=${transSeq}`).subscribe(data => {
              resolve(data);
          });
      });
  }

  public insertPurchOrderDetail(model) {
      return new Promise<any>((resolve, reject) => {
          this.api.post(`api/v1/order/purch-order-detail`, model).subscribe(data => {
              resolve(data);
          });
      });
  }

  public updatePurchOrderDetail(model) {
      return new Promise<any>((resolve, reject) => {
          this.api.put(`api/v1/order/purch-order-detail`, model).subscribe(data => {
              resolve(data);
          });
      });
  }

  public deletePurchOrderDetail(poSheetNo,transSeq) {
      return new Promise<any>((resolve, reject) => {
          this.api.delete(`api/v1/order/purch-order-detail/poSheetNo=${poSheetNo}&transSeq=${transSeq}`).subscribe(data => {
              resolve(data);
          });
      });
  }

  //------------------- Purch Order WoNo -------------------
  public getAllPurchOrderWoNo() {
    return new Promise<any>((resolve, reject) => {
        this.api.get(`api/v1/order/purch-order-wono`)
            .subscribe(data => {
                resolve(data.data);
                return;
            });
    });
  }

  public getPurchOrderWoNoById(poSheetNo,transSeq,woNo,woSeq) {
      return new Promise<any>((resolve, reject) => {
          this.api.get(`api/v1/order/purch-order-wono/poSheetNo=${poSheetNo}&transSeq=${transSeq}&woNo=${woNo}&woSeq=${woSeq}`).subscribe(data => {
              resolve(data);
          });
      });
  }

  public insertPurchOrderWoNo(model) {
      return new Promise<any>((resolve, reject) => {
          this.api.post(`api/v1/order/purch-order-wono`, model).subscribe(data => {
              resolve(data);
          });
      });
  }

  public updatePurchOrderWoNo(model) {
      return new Promise<any>((resolve, reject) => {
          this.api.put(`api/v1/order/purch-order-wono`, model).subscribe(data => {
              resolve(data);
          });
      });
  }

  public deletePurchOrderWoNo(poSheetNo,transSeq,woNo, woSeq) {
      return new Promise<any>((resolve, reject) => {
          this.api.delete(`api/v1/order/purch-order-wono/poSheetNo=${poSheetNo}&transSeq=${transSeq}&woNo=${woNo}&woSeq=${woSeq}`).subscribe(data => {
              resolve(data);
          });
      });
  }
}