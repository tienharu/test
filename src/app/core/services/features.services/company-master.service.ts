import { CompanyModel } from "@app/core/models/company.model";
import { Injectable } from "@angular/core";
import { NotificationService } from "@app/core/services/notification.service";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";

@Injectable()
export class CompanyMasterService {
  private companyMasterInfo: CompanyModel;

  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) {
    this.companyMasterInfo = new CompanyModel();
  }

  getModel(): CompanyModel {
    return this.companyMasterInfo;
  }

  storeTemporaryModel(companyMasterInfo: CompanyModel) {
    this.companyMasterInfo = companyMasterInfo;
  }

  resetModel() {
    this.companyMasterInfo = new CompanyModel();
  }

  public listCompany() {
    return new Promise<CompanyModel[]>((resolve, reject) => {
      this.api.get(`/company/list`).subscribe(data => {
        if (!data.success) {
          this.notificationService.showMessage("error", data.data.message);
          resolve([]);
          return;
        }
        resolve(data.data);
      });
    });
  }
  public deleteCompany(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("/company/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public registerDefaultAuthorData(companyId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get("/company/reg-data/" + companyId).subscribe(data => {
        resolve(data);
      });
    });
  }
  public insertCompany(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("company/insert", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public updateCompany(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("company/update", model).subscribe(data => {
        resolve(data);
      });
    });
  }
}
