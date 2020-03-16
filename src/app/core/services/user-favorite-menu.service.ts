import { Injectable, EventEmitter } from "@angular/core";
import { CRMSolutionApiService } from "../api/crm-solution-api.service";
import { NotificationService } from "./notification.service";
import { UserFavoriteMenuModel } from "../models/user.model";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class UserFavoriteMenuService {
  eventFavoriteMenu = new EventEmitter<Array<UserFavoriteMenuModel>>();
  favoriteMenus: UserFavoriteMenuModel[] = []
  constructor(
    private api: CRMSolutionApiService,
    private notificationService: NotificationService
  ) { }
  public initModel() {
    return new UserFavoriteMenuModel()
  }
  public GetListFavMenuByUser(companyId, userId) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`/auth/GetListFavMenuByUser?companyId=${companyId}&userId=${userId}`).subscribe(data => {
        if (data.status == 1) {
          resolve(data);
        } else {
          resolve();
        }
      });
    });
  }

  public addMenuToSever(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/auth/AddFavoriteMenu`, model).subscribe(data => {
        resolve(data);
      });
    });
  }

  public DeleteMenu(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/auth/DeleteFavoriteMenu`, model).subscribe(data => {
        resolve(data);
      });
    });
  }
  public BatchDeleteMenu(model) {
    return new Promise<any>((resolve, reject) => {
      this.api.post(`/auth/BatchDeleteFavoriteMenu`, model).subscribe(data => {
        resolve(data);
      });
    });
  }

  // setMenuWatching(menuInfo) {
  //   localStorage.setItem('menuWatching', JSON.stringify(menuInfo));
  // }
  // getMenuWatching() {
  //   return JSON.parse(localStorage.getItem('menuWatching'))
  // }
  addFavoriteMenu(menu) {
    // console.log('item',item)
    if (!this.checkMenuAlready(menu.menu_id)) {
      this.favoriteMenus.push(menu)
      this.eventFavoriteMenu.emit(this.favoriteMenus)
    }

  }
  removeFavoriteMenu(menu) {
    _.remove(this.favoriteMenus, c => c.menu_id == menu.menu_id)
    this.eventFavoriteMenu.emit(this.favoriteMenus)
  }
  removeAllFavoriteMenu() {
    this.favoriteMenus = []
    this.eventFavoriteMenu.emit(this.favoriteMenus)
  }
  checkMenuAlready(menuId) {
    let item = this.favoriteMenus.filter(c => c.menu_id == menuId)
    if (item.length == 0) {
      return false
    } else {
      return true
    }
  }
}
