import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '../api/crm-solution-api.service';
import { NotificationService } from './notification.service';
import { GlobalAcModel } from '../models/global-ac.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalAcService {
  private globalAcInfo: GlobalAcModel;
  constructor( private api: CRMSolutionApiService,
    private notificationService: NotificationService) { 
      this.globalAcInfo = new GlobalAcModel();
    }

    getModel(): GlobalAcModel{
      return this.globalAcInfo
    }

    storeTemporaryModel(globalAcInfo: GlobalAcModel) {
      this.globalAcInfo = globalAcInfo;
    }

    resetModel() {
      this.globalAcInfo = new GlobalAcModel();
    }

    public listGlobalAc() {
      return new Promise<any>((resolve, reject) => {
        this.api.get(`mas-account-global/list`).subscribe(data => {
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

    public deleteGlobalAc(id) {
      return new Promise<any>((resolve, reject) => {
        this.api.delete("mas-account-global/" + `${id}`).subscribe(data => {
          resolve(data);
        });
      });
    }
  
    public insertGlobalAc(model) {
      return new Promise<any>((resolve, reject) => {
        this.api.post("mas-account-global/", model).subscribe(data => {
          resolve(data);
        });
      });
    }
    public updateGlobalAc(model) {
      return new Promise<any>((resolve, reject) => {
        this.api.put("mas-account-global/", model).subscribe(data => {
          resolve(data);
        });
      });
    }
}
