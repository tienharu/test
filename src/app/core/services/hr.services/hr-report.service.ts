import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";

@Injectable()
export class HrReportService {
    constructor(private api: CRMSolutionApiService) {
    }

    public GetMonthlyOverTime(orgid, dutykindcd, year, month, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("report/monthly/overtime?orgid="+orgid+"&dutykindcd="+dutykindcd+"&year="+year+"&month="+month+"&pagesize="+pagesize+"&page="+page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoadMonthlyOverTime(orgid, dutykindcd, year, month) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/monthly/overtime/export?orgid="+orgid+"&dutykindcd="+dutykindcd+"&year="+year+"&month="+month)
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `monthly_overtime_${year}_${month}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public GetMonthlyDuty(orgid, dutykindcd, year, month, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("report/monthly/duty?orgid="+orgid+"&dutykindcd="+dutykindcd+"&year="+year+"&month="+month+"&pagesize="+pagesize+"&page="+page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoadMonthlyDuty(orgid, dutykindcd, year, month) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/monthly/duty/export?orgid="+orgid+"&dutykindcd="+dutykindcd+"&year="+year+"&month="+month)
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `monthly_duty_${year}_${month}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public GetMonthlyAttendance(year, month, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("report/monthly/attendance?year=" + year+"&month="+month+"&pagesize="+pagesize+"&page="+page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoadMonthlyAttendance(year, month) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/monthly/attendance/export?year="+year+"&month="+month)
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `monthly_attendance_${year}_${month}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public GetDailyDuty(year, month, day, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("report/daily/duty?year="+year+"&month="+month + "&day=" + day +"&pagesize="+pagesize+"&page="+page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoadDailyDuty(year, month, day) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/daily/duty/export?year="+year+"&month="+month + "&day=" + day )
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `daily_duty_${year}_${month}_${day}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public GetDailyDutyByDept(orgid, year, month, day, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("report/daily/duty/dept?orgid=" + orgid + "&year="+year+"&month="+month + "&day=" + day +"&pagesize="+pagesize+"&page="+page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoadDailyDutyByDept(orgid, year, month, day) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/daily/duty/dept/export?orgid=" + orgid +"&year="+year+"&month="+month + "&day=" + day )
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `daily_duty_by_dept_${year}_${month}_${day}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public GVNDownloadMonthlyAttendance(comId, orgId, year, month) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/gvn/monthly-attendance?companyId="+comId+"&departId="+orgId+"&year="+year+"&month="+month)
            .subscribe(data => {
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `monthly_attendance_${year}_${month}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }

    public GetAdidasMonthlyOverTime(orgid, year, month, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("report/monthly/overtime/adidas?orgid="+orgid+"&year="+year+"&month="+month+"&pagesize="+pagesize+"&page="+page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public DownLoadAdidasMonthlyOverTime(comId, orgid, year) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/adidas/monthly/overtime?companyId="+comId+"&orgid=" + orgid +"&year="+year)
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `adidas_monthly_overtime_${year}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }
    public DownLoadAdidasMonthlyTurnOver(comId, year) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/adidas/monthly/turnover?companyId=" + comId +"&year="+year)
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `adidas_monthly_turnover_rate_${year}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }
    public DownLoadAdidasWeeklyWorkingHour(comId, year) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("report/adidas/weekly-working-hour?companyId=" + comId +"&year="+year)
            .subscribe(data => {
                var blob = new Blob([data], {type: 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `adidas_weekly_working_hours_${year}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }
}