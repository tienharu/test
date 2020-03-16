import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { FactoryModel } from "@app/core/models/factory.model";
import { NotificationService } from "../notification.service";
import { HrAnnualLeaveModel, HrAnnualLeaveApprlModel } from "@app/core/models/hr/hr-annual-leave.model";
import { GeneralMasterModel } from "@app/core/models/general_master.model";


@Injectable({
  providedIn: 'root'
})
export class HrAnnualLeaveService {
  private hrAnnualLeaveModel: HrAnnualLeaveModel;
  private hrAnnualLeaveApprlModel: HrAnnualLeaveApprlModel;

  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService,
  ) { }

  public initModel(company_id): HrAnnualLeaveModel {
    this.hrAnnualLeaveModel = new HrAnnualLeaveModel();
    this.hrAnnualLeaveModel.company_id = company_id;
    return this.hrAnnualLeaveModel;
  }
  public initApprlModel(userId,changer): HrAnnualLeaveApprlModel {
    this.hrAnnualLeaveApprlModel = new HrAnnualLeaveApprlModel();
    this.hrAnnualLeaveApprlModel.apprl_by = userId
    this.hrAnnualLeaveApprlModel.changer = changer
    return this.hrAnnualLeaveApprlModel;
  }
  public getListAnnualLeave(companyId) {
    return new Promise<FactoryModel[]>((resolve, reject) => {
      this.api
        .get(`/employee/annual-leave/get-list?companyId=${companyId}`)
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
  public getListAnnualLeaveNotApprl(companyId,factoryId,orgId) {
    return new Promise<FactoryModel[]>((resolve, reject) => {
      this.api
        .get(`/employee/annual-leave/get-list-not-apprl?companyId=${companyId}&factoryId=${factoryId}&orgId=${orgId}`)
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
  public listGeneralByCate(cateCd) {
    return new Promise<GeneralMasterModel[]>((resolve, reject) => {
      this.api.get(`/general/details/catecd/${cateCd}`).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      });
    });
  }
  public insertOrUpdateAnnualLeave(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("employee/annual-leave/save", model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject();
          return;
        }
        resolve(data);
      });
    });
  }
  public deleteAnnualLeave(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("employee/annual-leave/delete", model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject();
          return;
        }
        resolve(data);
      });
    });
  }
  public apprlAnnualLeave(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("employee/annual-leave/apprl", model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject(data.error);
          return;
        }
        resolve(data);
      });
    });
  }
  public batchApprlAnnualLeave(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("employee/annual-leave/batch-apprl", model).subscribe(data => {
        if (data.error) {
          this.notificationService.showMessage("error", data.error.message);
          reject(data.error);
          return;
        }
        resolve(data);
      });
    });
  }
}