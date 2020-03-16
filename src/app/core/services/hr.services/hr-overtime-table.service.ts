import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrMasOvertimeModels, HrMasOvertimeTableModel, HrOvertimeTableDetailModel,  } from '@app/core/models/hr/hr-overtime-table.model';
import { NotificationService } from '../notification.service';
import { FactoryModel } from '@app/core/models/factory.model';

@Injectable({
  providedIn: 'root'
})
export class HrOvertimeTableService {

  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) {
  }



  public ListOvertimeDetail(company_id,ot_table_id,) {
    if (company_id <= 0) {
      return new Promise<any>((resolve, reject) => {
        resolve([]);
      });
    }
    return new Promise<any>((resolve, reject) => {
      this.api.get("overtime/overtime-table-detail/list?companyId="+company_id+'&otTableId='+ot_table_id).subscribe(data => {
        if (!data.total && !data.data) {
          resolve([]);
        }
        resolve(data.data);
      });
    });
  }

  public InsertOvertimeDetail(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("overtime/overtime-table-detail/save", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public DeleteOvertimeDetail(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("overtime/overtime-table-detail/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }
  

  public DeleteOvertimeTable(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("overtime/overtime-table/delete", model).subscribe(data => {
        resolve(data);
      });
    });
  }

   public InsertOvertimeTable(model, replace=false) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("overtime/overtime-table/save?replace="+replace, model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public GetOvertimeTableInfo(company_id, ot_table_id) {
    if(ot_table_id<=0){
      return new Promise<any>((resolve, reject) => {
        resolve({});
      });
    }
    return new Promise<any>((resolve, reject) => {
      this.api.get(`overtime/overtime-table/detail?companyid=${company_id}&otTableId=${ot_table_id}`).subscribe(data => {
        if(!data){
          resolve({});
        }
        resolve(data);
      });
    });
  }

  //Copy 
  public copyOvertimeTable(oldOtID, newOtModel, replace=false,fromTime,toTime,interval,minutes) {
    return new Promise<any>((resolve, reject) => {
      this.api.post("overtime/overtime-table/copy?oldOtID="+oldOtID+"&replace="+replace +"&fromTime="+fromTime+"&toTime="+ toTime +"&interval="+interval+"&minutes="+minutes, newOtModel).subscribe(data => {
        resolve(data);
      });
    });
  }



  public listOverTimeTable(companyId) {
    if (companyId <= 0) {
      return new Promise<any>((resolve, reject) => {
        resolve([]);
      });
    }
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/overtime/overtime-table/list?companyId=${companyId}`).subscribe(data => {
        if (!data.total && !data.data) {
          resolve([]);
        }
        resolve(data.data);
      });
    });
  }

 
}