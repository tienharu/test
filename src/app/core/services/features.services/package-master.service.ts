import { PackageModel } from "@app/core/models/package.model";
import { Injectable } from "@angular/core";
import { CRMSolutionApiService, NotificationService } from "..";


export class PackageMasterService {
  private packageMasterInfo: PackageModel;
  constructor(
  ) { 
    this.packageMasterInfo = new PackageModel();
  }
  // savePackage(model: PackageModel) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.api.post("/package/insert", model).subscribe(data => {
  //       resolve(data);
  //     });
  //   });
  // }
  // getPackageList() {
  //   let apiUrl = "/package/list";
  //   return new Promise<PackageModel[]>((resolve, reject) => {
  //     this.api.get(apiUrl).subscribe(data => {
  //       if (!data.success) {
  //         this.notificationService.showMessage("error", data.message);
  //         resolve([]);
  //         return;
  //       }
  //       resolve(data.data);
  //     });
  //   });
  // }
  // deletePackage(model: any) {
  //   let apiUrl = "/package/delete";
  //   return new Promise<any>((resolve, reject) => {
  //     this.api.post(apiUrl, model).subscribe(data => {
  //       resolve(data);
  //     });
  //   });
  // }

  getModel(): PackageModel {
    return this.packageMasterInfo;
  }

  storeTemporaryModel(packageMasterInfo: PackageModel) {
    this.packageMasterInfo = this.packageMasterInfo;
  }
  
  resetModel() {
    this.packageMasterInfo = new PackageModel();
  }
}
