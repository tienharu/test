import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '../api/crm-solution-api.service';
import { NotificationService } from './notification.service';
import { LocalLanguageModel } from '../models/local-language.model';

@Injectable({
  providedIn: 'root'
})
export class LocalLanguageService {
  private localLanguageModel: LocalLanguageModel
  constructor(private api: CRMSolutionApiService,
    private notificationService: NotificationService) { this.localLanguageModel = new LocalLanguageModel() }

  storeTemporaryModel(localLanguageModel: LocalLanguageModel) {
    this.localLanguageModel = localLanguageModel;
  }

  public listLocalLanguage(companyId,langGid,fsType) {
    if (companyId <= 0) {
      return new Promise<any>((resolve, reject) => {
        resolve([]);
      });
    }
    if (langGid == null) {
      return new Promise<any>((resolve, reject) => {
        resolve([]);
      });
    }
    return new Promise<any>((resolve, reject) => {
      this.api.get("mas-account-language/companyId=" + companyId + "&langGid=" + langGid + "&fsType=" + fsType  ).subscribe(data => {
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

 
  public updateLocalLanguge(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.put("mas-account-language/", model).subscribe(data => {
        resolve(data);
      });
    });
  }
}
