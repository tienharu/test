import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { Injectable } from "@angular/core";
import { NotificationService } from '@app/core/services/notification.service';
import { CompanyModel } from "@app/core/models/company.model";
import { resolve } from "dns";
import { reject } from "q";
import { GlobalMasterModel } from "@app/core/models/global_master.model";

@Injectable()
export class GlobalMasterService {
  private GlobalMasterInfo: GlobalMasterModel;

  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) {
    this.GlobalMasterInfo = new GlobalMasterModel();
  }

  getModel(): GlobalMasterModel {
    return this.GlobalMasterInfo;
  }

  storeTemporaryModel(GlobalMasterInfo: GlobalMasterModel) {
    this.GlobalMasterInfo = GlobalMasterInfo;
  }

  resetModel() {
    this.GlobalMasterInfo = new GlobalMasterModel();
  }

  public listGlobalMasterAll() {
    return new Promise<GlobalMasterModel[]>((resolve, reject) => {
      this.api.get(`global/list`).subscribe(data => {
        if (!data) {
          this.notificationService.showMessage("error", data.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      });
    });
  }

  public listCompanyBySeq(global_type, global_sector) {
    return new Promise<CompanyModel[]>((resolve, reject) => {
      this.api.get(`company/list/global-type/${global_type}/global-sector/${global_sector}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  public insertGlobal(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("global/insert", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public updateGlobal(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("global/update", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public deleteGlobal(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("global/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public listGlobalByType() {
    return new Promise<GlobalMasterModel[]>((resolve, reject) => {
      this.api.get(`/Global/material/biz-unit`).subscribe(data => {
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