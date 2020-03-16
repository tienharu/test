import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { NewsModel, NewsHeaderModel } from "@app/core/models/news.model";
import { resolve } from "dns";
import { reject } from "q";

@Injectable()
export class NewsService {
    private NewsInfo: NewsModel
    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService
    ) {
        this.NewsInfo = new NewsModel();
    }
    getModel(): NewsModel {
        return this.NewsInfo;
    }
    storeTemporaryModel(NewsInfo: NewsModel) {
        this.NewsInfo = NewsInfo;
    }
    resetModel() {
        this.NewsInfo = new NewsModel()
    }

    public listNews(company_id) {
        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<NewsModel[]>((resolve, reject) => {
            this.api.get(`/news/list?companyId=${company_id}`)
                .subscribe(data => {
                    resolve(data.data);
                });
        });
    }

    public listNewsHeader(company_id) {
        if (company_id <= 0) {
            return new Promise<any>((resolve, reject) => {
                resolve([]);
            });
        }
        return new Promise<NewsHeaderModel[]>((resolve, reject) => {
            this.api.get(`/news/list-hearder?companyId=${company_id}`)
                .subscribe(data => {
                    resolve(data.data);
                });
        });
    }

    public getDetailNews(company_id, id){
        if(id<=0){
            return new Promise<any>((resolve, reject) => {
              resolve([]);
            });
          }
        return new Promise<any>((resolve,reject)=>{
            this.api.get("/news/detail?companyId=" + company_id+"&&id=" + id).subscribe(data=>{
                if(!data){
                    resolve([]);
                  }
                resolve(data)
            })
        }) 

    }

    public saveNews(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("news/save", model).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.data.message);
                    resolve([]);
                    return;
                }
                resolve(data);
            });
        });
    }

    public deleteNews(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post("news/delete", model).subscribe(data => {
                resolve(data)
            });
        });
    }
}