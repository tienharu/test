import { Injectable } from '@angular/core';
import { HrMainInfoModel } from '@app/core/models/hr/hr-main-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';

@Injectable({
    providedIn: 'root'
})
export class GetInfoHrService {
    private hrMainInfoModel: HrMainInfoModel;

    constructor(private api: CRMSolutionApiService,private notificationService: NotificationService) {
    }

    //
    public getHrDetail(controller:string,companyId : number,hrID:string) {
        return new Promise<any>((resolve, reject) => {
          let url = `employee/${controller}/detail?companyId=${companyId}&hrId=${hrID}`;
          this.api.get(url).subscribe(data => {
            resolve(data);
          });
        });
      }
    
}
