import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { HrSalaryModel } from "@app/core/models/hr/hr-salary.model";

@Injectable({
    providedIn: 'root'
})
export class HrSalaryService {
    private hrSalaryInfoModel: HrSalaryModel
    SalaryInfo: HrSalaryModel;
    constructor(private api: CRMSolutionApiService,
    ) {
        this.hrSalaryInfoModel = new HrSalaryModel
    }

    resetModel() {
        this.SalaryInfo = new HrSalaryModel();
    }
    storeTemporaryModel(SalaryInfo: HrSalaryModel) {
        this.SalaryInfo = SalaryInfo;
    }

    getModel(): HrSalaryModel {
        return this.hrSalaryInfoModel;
    }
    public listSalary(company_id, jobTypeId,jobClassId, month, year) {
        if(jobClassId=='undefined'){
            jobClassId='';
        }
        if(jobTypeId=='undefined'){
            jobTypeId='';
        }
        if(month<=0 || year<=0){
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        
        return new Promise<any>((resolve, reject) => {
            this.api.get("basicsalary/list?companyId=" + company_id + '&jobTypeGenCd=' + jobTypeId  + '&jobClassGenCd=' + jobClassId+ '&month=' + month + '&year=' + year).subscribe(data => {
                if (!data.total && !data.data) {
                    resolve([]);
                }
                resolve(data.data);
            });
        });
    }

    public updateSalaryInfo(model: any) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("basicsalary/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public CreateSalaryInfo(company_id,month, year) {
        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.post("basicsalary/insert?companyId=" + company_id + '&month=' + month + '&year=' + year, this.SalaryInfo).subscribe(data => {
                resolve(data);
            });
        });
    }

   
    public deleteSalaryInfo(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("basicsalary/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public listTime(companyId) {
        if (companyId <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get(`/basicsalary/gettime?companyId=${companyId}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}