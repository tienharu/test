import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";

@Injectable()
export class PayrollMasterService {
    constructor(private api: CRMSolutionApiService) {
    }

    public GetPayrollMonths() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/master/months").subscribe(data => {
                resolve(data);
                return;
            });
        });
    }

    public getPayrollMaster(status, orgid, name, hrid, year, month, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/master/list?orgid=" + orgid + "&status=" + status + "&name=" + name + "&hrid=" + hrid + "&year=" + year + "&month=" + month + "&pagesize=" + pagesize + "&page=" + page)
            .subscribe(data => {
                resolve(data);
                return;
            });
        });
    }

    public PayrollMasterToExcel(status, orgid, name, hrid, year, month) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("payroll/master/excel?orgid="+orgid+"&year="+year+"&month="+month+"&status="+status+"&hrid="+hrid+"&name="+name)
            .subscribe(data => {
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `payroll_master_${year}_${month}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public createPayrollMaster(year, month, pagesize, override=false) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/master/create?year=" + year + "&month=" + month + "&pagesize=" + pagesize).subscribe(data => {
                resolve(data);
            });
        });
    }

    public savePayrollMaster(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("payroll/master/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public copyPayrollMaster(mfrom, yfrom, mto, yto, pagesize, override=false) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/master/copy?mfrom=" + mfrom + "&yfrom=" + yfrom + "&mto=" + mto + "&yto=" + yto + "&pagesize=" + pagesize + "&isOverride=" + override).subscribe(data => {
                resolve(data);
            });
        });
    }

    public closePayroll(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("payroll/closing/create", model).subscribe(
            data => {
                resolve(data);
            },
            error => {
                resolve({error:{message:'System error, please try again'}})
            });
        });
    }

    public deletePayroll(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("payroll/closing/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getPaymentSalary() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("payroll/closing/salary")
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoad(model, salary) {
        return new Promise<any>((resolve, reject) => {
            this.api.download_post("payroll/closing/export",model)
            .subscribe(data => {
                if(data.error){
                    resolve(data)
                    return;
                }
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `${salary}_${new Date().toString('dd-MMM-yyyy HH:m:s')}.xlsx`;
                link.click();
                resolve('ok');
            },
            error => {
                resolve({error:{message:'System error, please try again'}})
            });
        });
    }
}