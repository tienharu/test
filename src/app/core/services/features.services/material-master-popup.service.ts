import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { MaterialMasterPopupModel } from "@app/core/models/material-master-popup.model";
import { CustomerMaterialModel } from "@app/core/models/customer-material.model";

@Injectable()
export class MaterialMasterPopupService {
    private materialMasterPopupInfo: MaterialMasterPopupModel;

    constructor(
        private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.materialMasterPopupInfo = new MaterialMasterPopupModel();
    }

    getModel(): MaterialMasterPopupModel {
        return this.materialMasterPopupInfo;
    }

    resetModel() {
        this.materialMasterPopupInfo = new MaterialMasterPopupModel();
    }

    public listMaterialMasterPopupAll() {
        return new Promise<MaterialMasterPopupModel[]>((resolve, reject) => {
            this.api.get(`api/v1/mas_purch`).subscribe(data => {
                
                if (!data.success) {
                     //console.log("Gia tri data  bi looi     "+   data);
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
               // console.log("gia tri data",data);
                resolve(data.data);
            });
        });
    }
    public getCustomer() {
        return new Promise<CustomerMaterialModel[]>((resolve, reject) => {
            this.api.get(`customer/suppliers`).subscribe(data => {     
                if (!data.success) {
                    
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                
                resolve(data.data);
            });
        });
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
    public insertMaPopUp(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_purch`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateMaPopUp(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_purch`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteMaPopUp(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(``, model).subscribe(data => {
                resolve(data);
            });
        });
    }


    // public getInventoryUnit(companyId) {
    //     return new Promise<GeneralMasterModel[]>((resolve, reject) => {
    //         this.api.get(`/inventoryUnit/list?companyId=${companyId}`).subscribe(data => {
    //             resolve(data.data);
    //         });
    //     });
    // }

    // public getRoutingClass(companyId) {
    //     return new Promise<GeneralMasterModel[]>((resolve, reject) => {
    //         this.api.get(`/routingClass/list?companyId=${companyId}`).subscribe(data => {
    //             resolve(data.data);
    //         });
    //     });
    // }

    // public getLocations(companyId) {
    //     return new Promise<GeneralMasterModel[]>((resolve, reject) => {
    //         this.api.get(`/location/list?companyId=${companyId}`).subscribe(data => {
    //             resolve(data.data);
    //         });
    //     });
    // }
}