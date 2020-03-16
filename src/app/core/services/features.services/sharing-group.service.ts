import { AuthorityGroupModel } from "@app/core/models/authority-group.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { SharingGroupModel, SharingGroupUserModel, SharingGroupUserAddUpdateModel, SharingGroupMenuModel, SharingGroupMenuAddUpdateModel } from "@app/core/models/sharing-group.model";
import { Injectable } from "@angular/core";
import { resolve } from "path";
import { reject } from "q";
@Injectable()
export class SharingGroupService {
  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) { }



  public listSharingGroup(companyId) {
    return new Promise<SharingGroupModel[]>((resolve, reject) => {
      this.api
        .get(`/sharing-group/list?companyId=${companyId}`)
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
  public saveSharingGroup(model: SharingGroupModel) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sharing-group/save", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public deleteSharingGroup(model: SharingGroupModel) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sharing-group/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public listSharingGroupUsers(companyId, sharingGroupId) {
    if (companyId <= 0 || sharingGroupId <= 0) {
      return new Promise<any[]>((resolve, reject) => {
        resolve([]);
      });
    }
    return new Promise<SharingGroupUserModel[]>((resolve, reject) => {
      this.api
        .get(`/sharing-group/users/list?companyId=${companyId}&sharingGroupId=${sharingGroupId}`)
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
  public saveSharingGroupUsers(model: SharingGroupUserAddUpdateModel) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sharing-group/users/save", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public deleteSharingGroupUser(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sharing-group/users/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  

  
  // Menu
  public listSharingGroupMenu(companyId, sharingGroupId) {
    if (companyId <= 0 || sharingGroupId <= 0) {
      return new Promise<any[]>((resolve, reject) => {
        resolve([]);
      });
    }
    return new Promise<SharingGroupMenuModel[]>((resolve, reject) => {
      this.api.get("/sharing-group/menu/list?companyId=" + companyId +"&sharingGroupId=" + sharingGroupId)
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

  public saveSharingGroupMenu(model: SharingGroupMenuAddUpdateModel) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sharing-group/menu/save", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public deleteSharingGroupMenu(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("sharing-group/menu/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }
}
