import { Injectable } from '@angular/core';
import { HrMainInfoModel, EmployeeExtraInfo } from '@app/core/models/hr/hr-main-info.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '../notification.service';

@Injectable({
    providedIn: 'root'
})
export class HrMainInfoService {
    private hrMainInfoModel: HrMainInfoModel;

    constructor(private api: CRMSolutionApiService,private notificationService: NotificationService) {
        this.hrMainInfoModel = new HrMainInfoModel();
    }
    getModel(): HrMainInfoModel {
        return this.hrMainInfoModel;
    }

    storeTemporaryModel(systemMenuInfo: HrMainInfoModel) {
        this.hrMainInfoModel = systemMenuInfo;
    }

    resetModel() {
        this.hrMainInfoModel = new HrMainInfoModel();
    }

    public insertHrMainInfo(model, autoGenHrId:any) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("employee/save"+(autoGenHrId?'?autoGenHrId='+autoGenHrId:''), model).subscribe(data => {
            resolve(data);
          });
        });
      }
    public DeleteHrMainInfo(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("employee/delete", model).subscribe(data => {
              resolve(data);
            });
          });
    }
    public getExtraInfo(comId, hrId) {
      return new Promise<EmployeeExtraInfo>((resolve, reject) => {
        this.api.get("employee/extra-info?companyId="+comId+"&hrId="+hrId).subscribe(data => {
          if(data.error){
              this.notificationService.showMessage('error',data.error.message)
              resolve(new EmployeeExtraInfo());
              return;
          }
          resolve(data);
        });
      });
  }
    public listHrMainInfo(company_id) {
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/list/all?companyId="+company_id).subscribe(data => {
            if(data.error){
                this.notificationService.showMessage('error',data.error.message)
                resolve([]);
                return;
            }
            resolve(data);
          });
        });
    }
    public listAllHR(company_id, departId, keyword,filterStatus,from,to) {
      return new Promise<any>((resolve, reject) => {
        this.api.get(`employee/list/all?companyId=${company_id}&departId=${departId}&keyword=${keyword}&filterStatus=${filterStatus}&from=${from}&to=${to}`).subscribe(data => {
          if(data.error){
              this.notificationService.showMessage('error',data.error.message)
              resolve([]);
              return;
          }
          resolve(data);
        });
      });
  }
    //default for combobox binding(result data only {hr_id & employee_nm})
    //if u want more epl info in result, call func with mode=full
    public listEmployee(companyId, mode:string='less') {
        return new Promise<any>((resolve, reject) => {
          this.api.get(`employee/list?companyId=${companyId}&mode=${mode}`).subscribe(data => {
            if(data.error){
                this.notificationService.showMessage('error',data.error.message)
                reject();
                return;
            }
            resolve(data);
          });
        });
    }

    public listEmployeeDepart(companyId,departId,mode:string='less') {
        return new Promise<any[]>((resolve, reject) => {
          this.api
            .get(`/employee/list/department?companyId=${companyId}&mode=${mode}&departId=${departId}`)
            .subscribe(data => {
              if (data.error) {
                this.notificationService.showMessage("error", data.error.message);
                reject();                
                return;
              }
              resolve(data.data);
            });
        });
      }


      public getdetailEmployee(companyId, hrId) {
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/detail?companyId="+companyId+"&hrId="+hrId).subscribe(data => {
            if(!data){
              resolve({});
            }
            resolve(data);
          });
        });
    }

      public listEmployeePrint(company_id, hr_id, emloyee_nm : any ='') {
        return new Promise<any>((resolve, reject) => {
          this.api.get("employee/list/all?companyId="+company_id + "&HrId=" + hr_id + "&keyword=" + emloyee_nm ).subscribe(data => {
            if(data.error){
                this.notificationService.showMessage('error',data.error.message)
                resolve([]);
                return;
            }
            resolve(data.data);
          });
        });
    }
    public listEmployeeToExcel(comId, departId, keyword,filterStatus,from,to) {
      return new Promise<any>((resolve, reject) => {
          this.api.download(`employee/excel?companyId=${comId}&departId=${departId}&keyword=${keyword}&filterStatus=${filterStatus}&from=${from}&to=${to}`)
          .subscribe(data => {
            if (data.error) {
              this.notificationService.showMessage("error", data.error.message);
              return;
            }
              var downloadURL = window.URL.createObjectURL(data);
              var link = document.createElement('a');
              link.href = downloadURL;
              link.download = `HR List-${new Date().toString('dd-MM-yyyy-hh-mm-ss')}.xlsx`;
              link.click();
              resolve('ok');
          });
      });
  }
}
