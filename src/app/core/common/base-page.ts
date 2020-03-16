import { AuthService } from "../services";
import { Injectable } from "@angular/core";
import { GeneralMasterService } from "../services/features.services/general-master.service";
import { PagePermisionModel } from "../models/auth_user.model";
import { Router } from "@angular/router";

export class BasePage {
  public loggedUser: any;
  public companyInfo: any;
  public permission: PagePermisionModel = new PagePermisionModel();

  constructor(public userService: AuthService) {
    //, private route:Router
    //login user info
    this.loggedUser = this.userService.getUserInfo();
    //login user's company info
    this.companyInfo = { company_id: this.loggedUser.company_id, company_nm: this.loggedUser.company_nm };


  }

  public async checkPermission(menuId) {
    return await this.userService.checkPermission(menuId).then(data => {
      // this.permission.canSearch = true ;        this.permission.canSave = true ;      this.permission.canDelete = true ;        this.permission.canPosting = true ;  
      if (!data) {
        window.location.href = '/#/error/error403'
        //this.route.navigate(['/error/error404']);
        return;
      } else {
        if (!data.search_yn && !data.save_yn && !data.delete_yn && !data.posting_yn) {
          //this.route.navigate(['/error/error404']);
          window.location.href = '/#/error/error403'
          return;
        } else {
          this.permission.canSearch = data.search_yn;
          this.permission.canSave = data.save_yn;
          this.permission.canDelete = data.delete_yn;
          this.permission.canPosting = data.posting_yn;
        }
      }
    });
  }

  //get current time m:s:t for debugging
  public currentTime() {
    var d = new Date();
    return d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
  }
}
