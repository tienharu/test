import { Injectable } from '@angular/core';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { crmCustomerDetailModel } from '@app/core/models/crm/customer-detail.model';
import { CrmActivityEmailModel } from '@app/core/models/crm/activity-email.model';
import { CrmActivityTelModel } from '@app/core/models/crm/activity-tel.model';
import { CrmActivityMeetingModel } from '@app/core/models/crm/activity-meeting.model';
import { CrmActivityIssueModel } from '@app/core/models/crm/activity-issue.model';
import { CrmProjectTaskModel } from '@app/core/models/crm/activity-support.model';

@Injectable({
    providedIn: 'root'
})
export class crmCustomerDetailService {
    private crmCustomerDetailModel: crmCustomerDetailModel;

    constructor(private api: CRMSolutionApiService) {
        this.crmCustomerDetailModel = new crmCustomerDetailModel();
    }
    getModel(): crmCustomerDetailModel {
        return this.crmCustomerDetailModel;
    }

    storeTemporaryModel(systemMenuInfo: crmCustomerDetailModel) {
        this.crmCustomerDetailModel = systemMenuInfo;
    }

    resetModel() {
        this.crmCustomerDetailModel = new crmCustomerDetailModel();
    }
    public getDetail(traderId, isGetSharingData:boolean=null) {
        if(traderId<=0){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`trader/detail?traderId=${traderId}${isGetSharingData==true?'&getSharingData=true':''}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
}
@Injectable({
  providedIn: 'root'
})
export class CrmActivityEmailService {
    private CrmActivityEmailModel: CrmActivityEmailModel;

    constructor(private api: CRMSolutionApiService) {
        this.CrmActivityEmailModel = new CrmActivityEmailModel();
    }
    getModel(): CrmActivityEmailModel {
        return this.CrmActivityEmailModel;
    }

    storeTemporaryModel(systemMenuInfo: CrmActivityEmailModel) {
        this.CrmActivityEmailModel = systemMenuInfo;
    }

    resetModel() {
        this.CrmActivityEmailModel = new CrmActivityEmailModel();
    }

    public getEmailInfo(companyId,inputFucId,FuncRefId) {
        if(companyId<=0 || FuncRefId == ""){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`activity/email/list?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
    public getEmailDetail(companyId,inputFucId,FuncRefId, EmailId) {
        return new Promise<any>((resolve, reject) => {
          this.api.get(`activity/email/detail?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}&EmailId=${EmailId}`).subscribe(data => {
            if(!data){
              resolve([]);
            }
            resolve(data);
          });
        });
  }
    public insertActivityEmail(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/email/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteActivityEmail(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/email/delete", model).subscribe(data => {
            resolve(data);
          });
        });
    }
}

@Injectable({
  providedIn: 'root'
})
export class CrmActivityTelService {
    private CrmActivityTelModel: CrmActivityTelModel;

    constructor(private api: CRMSolutionApiService) {
        this.CrmActivityTelModel = new CrmActivityTelModel();
    }
    getModel(): CrmActivityTelModel {
        return this.CrmActivityTelModel;
    }

    storeTemporaryModel(systemMenuInfo: CrmActivityTelModel) {
        this.CrmActivityTelModel = systemMenuInfo;
    }

    resetModel() {
        this.CrmActivityTelModel = new CrmActivityTelModel();
    }

    public getTelInfo(companyId,inputFucId,FuncRefId) {
        if(companyId<=0 || FuncRefId == ""){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`activity/tel/list?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
    public getTelDetail(companyId,inputFucId,FuncRefId, TelId) {
      return new Promise<any>((resolve, reject) => {
        this.api.get(`activity/tel/detail?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}&TelId=${TelId}`).subscribe(data => {
          if(!data){
            resolve([]);
          }
          resolve(data);
        });
      });
}
    public insertActivityTel(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/tel/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteActivityTel(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/tel/delete", model).subscribe(data => {
            resolve(data);
          });
        });
    }
}

@Injectable({
  providedIn: 'root'
})
export class CrmActivityMeetingService {
    private CrmActivityMeetingModel: CrmActivityMeetingModel;

    constructor(private api: CRMSolutionApiService) {
        this.CrmActivityMeetingModel = new CrmActivityMeetingModel();
    }
    getModel(): CrmActivityMeetingModel {
        return this.CrmActivityMeetingModel;
    }

    storeTemporaryModel(systemMenuInfo: CrmActivityMeetingModel) {
        this.CrmActivityMeetingModel = systemMenuInfo;
    }

    resetModel() {
        this.CrmActivityMeetingModel = new CrmActivityMeetingModel();
    }

    public getMeetingInfo(companyId,inputFucId,FuncRefId) {
        if(companyId<=0 || FuncRefId == ""){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`activity/meeting/list?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
    public getMeetingDetail(companyId,inputFucId,FuncRefId, MeetingId) {
      return new Promise<any>((resolve, reject) => {
        this.api.get(`activity/meeting/detail?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}&MeetingId=${MeetingId}`).subscribe(data => {
          if(!data){
            resolve([]);
          }
          resolve(data);
        });
      });
}
    public insertActivityMeeting(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/meeting/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteActivityMeeting(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/meeting/delete", model).subscribe(data => {
            resolve(data);
          });
        });
    }
}

@Injectable({
  providedIn: 'root'
})
export class CrmActivityIssueService {
    private CrmActivityIssueModel: CrmActivityIssueModel;

    constructor(private api: CRMSolutionApiService) {
        this.CrmActivityIssueModel = new CrmActivityIssueModel();
    }
    getModel(): CrmActivityIssueModel {
        return this.CrmActivityIssueModel;
    }

    storeTemporaryModel(systemMenuInfo: CrmActivityIssueModel) {
        this.CrmActivityIssueModel = systemMenuInfo;
    }

    resetModel() {
        this.CrmActivityIssueModel = new CrmActivityIssueModel();
    }

    public getIssueInfo(companyId,inputFucId,FuncRefId) {
        if(companyId<=0 || FuncRefId == ""){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`activity/issue/list?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
    public getIssueDetail(companyId,inputFucId,FuncRefId, IssueId) {
      return new Promise<any>((resolve, reject) => {
        this.api.get(`activity/issue/detail?companyId=${companyId}&inputFucId=${inputFucId}&FuncRefId=${FuncRefId}&IssueId=${IssueId}`).subscribe(data => {
          if(!data){
            resolve([]);
          }
          resolve(data);
        });
      });
}
    public insertActivityIssue(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/issue/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteActivityIssue(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/issue/delete", model).subscribe(data => {
            resolve(data);
          });
        });
    }
}

@Injectable({
  providedIn: 'root'
})
export class CrmActivitySupportService {
    private CrmActivitySupportModel: CrmProjectTaskModel;

    constructor(private api: CRMSolutionApiService) {
        this.CrmActivitySupportModel = new CrmProjectTaskModel();
    }
    getModel(): CrmProjectTaskModel {
        return this.CrmActivitySupportModel;
    }

    storeTemporaryModel(systemMenuInfo: CrmProjectTaskModel) {
        this.CrmActivitySupportModel = systemMenuInfo;
    }

    resetModel() {
        this.CrmActivitySupportModel = new CrmProjectTaskModel();
    }

    public getSupportInfo(companyId,ProjectId) {
        if(companyId<=0 || ProjectId == ""){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`activity/support/list?companyId=${companyId}&ProjectId=${ProjectId}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
    public getSupportDetail(companyId,ProjectTaskId) {
      return new Promise<any>((resolve, reject) => {
        this.api.get(`activity/support/detail?companyId=${companyId}&ProjectTaskId=${ProjectTaskId}`).subscribe(data => {
          if(!data){
            resolve([]);
          }
          resolve(data);
        });
      });
}
    public insertActivitySupport(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/support/save", model).subscribe(data => {
            resolve(data);
          });
        });
      }
      public DeleteActivitySupport(model) {
        return new Promise<any>((resolve, reject) => {
          this.api.post("activity/support/delete", model).subscribe(data => {
            resolve(data);
          });
        });
    }
}

