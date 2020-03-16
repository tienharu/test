import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";

@Injectable({
    providedIn: 'root'
})
export class HrShiftworkService {
    constructor(private api: CRMSolutionApiService, 
                private notificationService: NotificationService) {
    }
    public listShiftWorkCreated(companyId,month, year) {
       
      return new Promise<any>((resolve, reject) => {
        this.api.get("hr/shiftwork/list-created?companyId="+companyId+'&month='+month+'&year='+year).subscribe(data => {
          resolve(data);
        });
      });
  }
    public getShiftWorkTable(companyId,departId, month, year, hrId='') {
       
          return new Promise<any>((resolve, reject) => {
            this.api.get("hr/shiftwork/table?companyId="+companyId+'&departId='+departId+'&month='+month+'&year='+year+'&hrId='+hrId).subscribe(data => {
              resolve(data);
            });
          });
      }
      public saveShiftworkInfo(model:any) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("hr/shiftwork/add", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public updateShiftworkTable(departId, model:any) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("hr/shiftwork/table/update?departId="+departId, model).subscribe(data => {
            resolve(data);
          });
        });
      }
}