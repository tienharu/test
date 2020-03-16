import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { Injectable } from "@angular/core";
import { CategoryModel } from "@app/core/models/category.model";
import { NotificationService } from '@app/core/services/notification.service';
@Injectable()
export class GeneralMasterService {
  private GeneralMasterInfo: GeneralMasterModel;

  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) {
    this.GeneralMasterInfo = new GeneralMasterModel();
  }

  getModel(): GeneralMasterModel {
    return this.GeneralMasterInfo;
  }

  storeTemporaryModel(GeneralMasterInfo: GeneralMasterModel) {
    this.GeneralMasterInfo = GeneralMasterInfo;
  }

  resetModel() {
    this.GeneralMasterInfo = new GeneralMasterModel();
  }

  public listGeneralCategory() {
    return new Promise<CategoryModel[]>((resolve, reject) => {
      this.api.get(`/cate/list`).subscribe(data => {
        if (!data.success) {
          this.notificationService.showMessage("error", data.data.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      });
    });
  }

  public listGeneralAll() {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      this.api.get(`/general/list`).subscribe(data => {
        if (!data.success) {
          this.notificationService.showMessage("error", data.data.message);
          resolve([]);
          return;
        }

        resolve(data.data);
      });
    });
  }

  public listGeneralByCate(cateCd) {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      this.api.get(`/general/details/catecd/${cateCd}`).subscribe(data => {
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

  public copyGeneralFromSysGeneral(companyId) {
    return new Promise<any>((resolve, reject) => {
      this.api
        .post("general/sys/copy?companyId=" + companyId, null)
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  public insertGeneralInfo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("general/insert", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public updateGeneralInfo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("general/update", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public deleteGeneral(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("/general/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public listSystemGeneral() {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      this.api.get(`/sysgeneral/list`).subscribe(data => {
        if (!data.success) {
          this.notificationService.showMessage("error", data.data.message);
          resolve([]);
          return;
        }

        resolve(data.data);
      });
    });
  }

  public insertSystemGeneralInfo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sysgeneral/insert", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public updateSystemGeneralInfo(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sysgeneral/update", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  
  public listGeneralItemizedByMaterial() {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      this.api.get(`/general/list/material-itemized`).subscribe(data => {
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

  public listGeneralItemizedByItem() {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      this.api.get(`/general/list/item-itemized`).subscribe(data => {
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
}
