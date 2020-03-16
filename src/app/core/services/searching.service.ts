import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "../api/crm-solution-api.service";
import { NotificationService } from "./notification.service";
import { UserFavoriteMenuModel } from "../models/user.model";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class SearchingService {
  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) { }
  public initModel() {
    return new UserFavoriteMenuModel()
  }
  public getResultSearch(companyId, userId, keyword) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/searching/get-result-search?companyId=${companyId}&userId=${userId}&keyword=${keyword}`).subscribe(data => {
        if (data.total == 1) {
          resolve(data);
        } else {
          this.notificationService.showMessage("error", data.error.message);
          resolve();
        }
      });
    });
  }

  public getResultSearchDapper(companyId, userId, keyword) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/searching/get-result-search-dapper?companyId=${companyId}&userId=${userId}&keyword=${keyword}`).subscribe(data => {
        if (data.total == 1) {
          resolve(data);
        } else {
          this.notificationService.showMessage("error", data.error.message);
          resolve();
        }
      });
    });
  }

  public stopIntervalHighLight() {
    let id = Number(localStorage.getItem('idInterval'))
    if (id)
      clearInterval(id)
  }
}
