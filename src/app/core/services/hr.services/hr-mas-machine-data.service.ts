import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { HrMasMachineDataModel } from '@app/core/models/hr/hr-mas-machine-data.model';
import { NotificationService } from '../notification.service';

@Injectable({
    providedIn: 'root'
})

export class HrMachineDataService {
    
    constructor(private notification: NotificationService,private api: CRMSolutionApiService) {
    }

    public listAttendanceMachineData(company_id, hr_id,from,to) {
       
       
        return new Promise<any>((resolve, reject) => {
            this.api.get("employee/machine/list?companyId=" + company_id + '&hrId='+hr_id+'&from='+from +'&to='+to).subscribe(data => {
                if(data.error){
                    this.notification.showError(data.error.message);
                    resolve([]);
                  }
                else{
                    resolve(data.data);
                }
            });
        });
    }

    public downloadAttendanceMachineData(company_id, hr_id,from,to) {
       
        return new Promise<any>((resolve, reject) => {
            this.api.download("employee/machine/download-in-excel?companyId=" + company_id + '&hrId='+hr_id+'&from='+from +'&to='+to)
            .subscribe(data => {
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = `machine_employee_from_${from}_to${to}.xlsx`;
                link.click();
                resolve('ok');
            });
        });
    }
}