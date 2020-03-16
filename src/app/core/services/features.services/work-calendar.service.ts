import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { WorkCalendarModel } from '@app/core/models/work-calendar.model';

@Injectable()
export class WorkCalendarService {
  private WorkCalendarModel: WorkCalendarModel;

  constructor(
    private api: CRMSolutionApiService
  ) {
    this.WorkCalendarModel = new WorkCalendarModel();
  }

  public getWorkCalendar(companyId, factoryId, year, month) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`work/calender/get?companyId=${companyId}&factoryId=${factoryId}&year=${year}&month=${month}`).subscribe(data => {
        if (data.success) {
            resolve(data);
            return;
        }
        else {
          resolve(data);
          return;
        }
      });
    });
  }

  public saveWorkCalendar(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("work/calender/save", model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public copyWorkCalendar(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("work/calender/copy", model).subscribe(data => {
        resolve(data);
      });
    });
  }
}