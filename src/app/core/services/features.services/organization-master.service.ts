import { OrganizationModel, FactoryModel } from "@app/core/models/organization.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";

@Injectable()
export class OrganizationMasterService {
  private OrganizationMasterInfo: OrganizationModel;

  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) {
    this.OrganizationMasterInfo = new OrganizationModel();
  }

  getModel(): OrganizationModel {
    return this.OrganizationMasterInfo;
  }

  storeTemporaryModel(OrganizationMasterInfo: OrganizationModel) {
    this.OrganizationMasterInfo = OrganizationMasterInfo;
  }

  resetModel() {
    this.OrganizationMasterInfo = new OrganizationModel();
  }
  public listFactory(companyId) {
    return new Promise<FactoryModel[]>((resolve, reject) => {
      this.api
        .get(`/factory/list?companyId=${companyId}`)
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
  public listOrganization(companyId) {
    return new Promise<OrganizationModel[]>((resolve, reject) => {
      this.api
        .get(`/org/list?companyId=${companyId}`)
        .subscribe(data => {
          if (!data.success) {
            this.notificationService.showMessage("error", data.data.message);
            resolve([]);
            return;
          }
          resolve(data.data);
        });
    });
  }
 
  public deleteOrganization(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("/org/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public insertOrganization(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("org/insert", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public updateOrganization(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("org/update", model).subscribe(data => {
        resolve(data);
      });
    });
  }
}
