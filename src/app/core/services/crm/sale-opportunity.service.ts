import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { CrmSalesOpportunityModel, CrmSalesActivityModel } from "@app/core/models/crm/sales-opportunity.model";

@Injectable({
    providedIn: 'root'
  })
export class CrmSalesOpportunityService {
    private CrmSalesOpportunityInfo: CrmSalesOpportunityModel;

    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.CrmSalesOpportunityInfo = new CrmSalesOpportunityModel();
    }

    getModel(): CrmSalesOpportunityModel {
        return this.CrmSalesOpportunityInfo;
    }

    resetModel() {
        return this.CrmSalesOpportunityInfo = new CrmSalesOpportunityModel();
    }

    storeTemporaryModel(CrmSalesOpportunityInfo: CrmSalesOpportunityModel) {
        this.CrmSalesOpportunityInfo = CrmSalesOpportunityInfo;
    }

    public ListSalesOpportunity(company_id) {

        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get(`Salesopt/list?companyid=${company_id}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data.data)
            })
        })
    }
    public ListSalesOpportunityPaging(company_id,keyword:any='',useYn:any='',page:any='', pageSize:any='') {

        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        this.notificationService.showCenterLoading();
        return new Promise<any>((resolve, reject) => {
            this.api.get(`Salesopt/list?companyid=${company_id}&keyword=${keyword}&useYn=${useYn}&page=${page}&pageSize=${pageSize}`).subscribe(data => {
                this.notificationService.hideCenterLoading();
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data)
            })
        })
    }
    public getDetail(SalesoptId, isGetSharingData:boolean=null) {
        if(SalesoptId<=0){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`Salesopt/detail?SalesoptId=${SalesoptId}${isGetSharingData==true?'&getSharingData=true':''}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
    public ShortList(company_id,keyword:string ='') {

        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get(`Salesopt/shortlist?companyid=${company_id}&keyword=${keyword}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data)
            })
        })
    }

    public InsertSalesOpportunity(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("Salesopt/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public DeleteSalesOpportunity(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("Salesopt/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }
}

@Injectable({
    providedIn: 'root'
  })
  export class CrmActivityBusinessService {
      private crmSalesActivityModel: CrmSalesActivityModel;
  
      constructor(private api: CRMSolutionApiService) {
          this.crmSalesActivityModel = new CrmSalesActivityModel();
      }
      getModel(): CrmSalesActivityModel {
          return this.crmSalesActivityModel;
      }
  
      storeTemporaryModel(systemMenuInfo: CrmSalesActivityModel) {
          this.crmSalesActivityModel = systemMenuInfo;
      }
  
      resetModel() {
          this.crmSalesActivityModel = new CrmSalesActivityModel();
      }
  
      public getBusinessInfo(companyId,SalesoptId) {
          if(companyId<=0 || SalesoptId <=0){
            return new Promise<any>((resolve, reject) => {
              resolve([]);
            });
          }
            return new Promise<any>((resolve, reject) => {
              this.api.get(`activity/business/list?companyId=${companyId}&SalesoptId=${SalesoptId}`).subscribe(data => {
                if(!data){
                  resolve([]);
                }
                resolve(data);
              });
            });
      }
      public getBusinessDetail(SalesoptId, ActivityId) {
          return new Promise<any>((resolve, reject) => {
            this.api.get(`activity/business/detail?SalesoptId=${SalesoptId}&ActivityId=${ActivityId}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }
      public insertActivityBusiness(model) {
          return new Promise<any>((resolve, reject) => {
            this.api.post("activity/business/save", model).subscribe(data => {
              resolve(data);
            });
          });
        }
        public DeleteActivityBusiness(model) {
          return new Promise<any>((resolve, reject) => {
            this.api.post("activity/business/delete", model).subscribe(data => {
              resolve(data);
            });
          });
      }
  }
