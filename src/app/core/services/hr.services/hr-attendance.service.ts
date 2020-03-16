import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";

@Injectable()
export class AttendanceService {
    constructor(private api: CRMSolutionApiService,private notificationService: NotificationService) {
    }

    //Daily Attendance
    public getAttendanceEmployees(orgid, hrid, vacation, year, month, day, iswithoutinout, isWarning, pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("attendance/getpaging?orgid=" + orgid + "&hrid=" + hrid + "&vacation=" + vacation  + "&year=" + year + "&month=" + month + "&day=" + day + "&iswithoutinout=" + iswithoutinout + "&iswarning=" + isWarning + "&pagesize=" + pagesize + "&page=" + page)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public createEmployeeAttendance(orgid, hrid, mode, vacation, year, month, day, pagesize) {
        return new Promise<any>((resolve, reject) => {
            this.api.get("attendance/create?orgid=" + orgid + "&hrid=" + hrid + "&mode=" + mode + "&vacation=" + vacation + "&year=" + year + "&month=" + month + "&day=" + day + "&pagesize=" + pagesize)
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public saveEmployeeAttendance(mode, vacation, items) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/save?mode=" + mode + "&vacation=" + vacation, items).subscribe(data => {
                resolve(data);
            });
        });
    }
    public saveEmployeeAttendanceByPerson(hrId, from, to, vacation, items) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/save-by-person?hrId=" + hrId + "&from=" + from + "&to=" + to + "&vacation=" + vacation, items).subscribe(data => {
                resolve(data);
            });
        });
    }
    public updateAttendanceWorkingTime(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/update-working-time", model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public getAttendanceLog() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("attendance/getattendlog")
            .subscribe(data => {
                resolve(data);
            });
        });
    }

    public saveSetting(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/setting/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getSetting() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("attendance/setting/get").subscribe(data => {
                resolve(data);
            });
        });
    }
    
    
    public getSettingByPerson() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("attendance/setting/person/get").subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteSetting(resetid, items) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/setting/delete?resetid=" + resetid, items).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteSettingByPerson(resetid, items) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/setting/person/delete?resetid=" + resetid, items).subscribe(data => {
                resolve(data);
            });
        });
    }

    //Attendance By Person
    public getEmployees() {
        return new Promise<any>((resolve, reject) => {
            this.api.get("attendance/getemployee").subscribe(data => {
                resolve(data);
            });
        });
    }

    public getAttendanceByPerson(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("attendance/person", model).subscribe(data => {
                resolve(data);
            });
        });
    }
    public dailyAttendanceToExcel(orgid, hrid, vacation, year, month, day, iswithoutinout, isWarning) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("attendance/excel/daily-attendance?orgid=" + orgid + "&hrid=" + hrid + "&vacation=" + vacation  + "&year=" + year + "&month=" + month + "&day=" + day + "&iswithoutinout=" + iswithoutinout + "&iswarning=" + isWarning )
            .subscribe(data => {
              if (data.error) {
                this.notificationService.showMessage("error", data.error.message);
                return;
              }
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `Daily-Attendance-${year}-${month}-${day}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }
    public personAttendanceToExcel(hrid, from, to, name, department) {
        return new Promise<any>((resolve, reject) => {
            this.api.download("attendance/excel/person-attendance?&hrid=" + hrid + "&from=" + from + "&to=" + to + "&name=" + name + "&department=" + department )
            .subscribe(data => {
              if (data.error) {
                this.notificationService.showMessage("error", data.error.message);
                return;
              }
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `Attendance-By-${hrid}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }
}