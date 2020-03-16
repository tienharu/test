import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { CrmProjectModel } from "@app/core/models/crm/project.model";

@Injectable({
    providedIn: 'root'
  })
export class CrmProjectService {
    private CrmProjectInfo: CrmProjectModel;

    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.CrmProjectInfo = new CrmProjectModel();
    }

    getModel(): CrmProjectModel {
        return this.CrmProjectInfo;
    }

    resetModel() {
        return this.CrmProjectInfo = new CrmProjectModel();
    }

    storeTemporaryModel(CrmProjectInfo: CrmProjectModel) {
        this.CrmProjectInfo = CrmProjectInfo;
    }

    public ListProject(company_id) {

        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<any>((resolve, reject) => {
            this.api.get(`project/list?companyid=${company_id}`).subscribe(data => {
                if (data.error) {
                    this.notificationService.showMessage("error", data.error.message);
                    resolve([]);
                    return;
                }
                resolve(data.data)
            })
        })
    }
    public getDetail(ProjectId, isGetSharingData:boolean=null) {
        if(ProjectId<=0){
          return new Promise<any>((resolve, reject) => {
            resolve([]);
          });
        }
          return new Promise<any>((resolve, reject) => {
            this.api.get(`Project/detail?ProjectId=${ProjectId}${isGetSharingData==true?'&getSharingData=true':''}`).subscribe(data => {
              if(!data){
                resolve([]);
              }
              resolve(data);
            });
          });
    }

    public InsertProject(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("Project/save", model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public DeleteProject(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("Project/delete", model).subscribe(data => {
                resolve(data);
            });
        });
    }
}