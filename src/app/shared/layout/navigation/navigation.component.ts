import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { LoginInfoComponent } from "@app/shared/user/login-info/login-info.component";
import { ProgramModel } from '@app/core/models/program.model';
import { ProgramService } from '@app/core/services/program.service';
import { LayoutService, CRMSolutionApiService, NotificationService, AuthService } from '@app/core/services';
import { SystemMenuModel } from '@app/core/models/system-menu.model';
import { HierarchyMenuModel } from '@app/core/models/hierarchy-menu.model';
import { config } from "@app/core/smartadmin.config";
import { I18nService } from '@app/shared/i18n/i18n.service';
import { UserFavoriteMenuService } from '@app/core/services/user-favorite-menu.service';
import { UserFavoriteMenuModel } from '@app/core/models/user.model';
import { BasePage } from '@app/core/common/base-page';
@Component({
  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent extends BasePage implements OnInit, AfterViewInit {
  openedPrograms: Array<ProgramModel> = [];
  fixedNav: boolean = this.layoutService.store.fixedNavigation;
  isMenuOnTop: boolean = this.layoutService.store.menuOnTop;
  menuFavorites: Array<UserFavoriteMenuModel> = [];
  userFavoriteMenuModel: UserFavoriteMenuModel

  hierarchyMenu: HierarchyMenuModel[] = [];
  private $menu: any;
  constructor(private programService: ProgramService,
    private layoutService: LayoutService,
    private router: Router,
    public userService: AuthService,
    private notiService: NotificationService,
    private api: CRMSolutionApiService,
    private i18nService: I18nService,
    private userFavoriteMenuService: UserFavoriteMenuService,
    private notificationService: NotificationService,

  ) {
    super(userService);

  }


  ngOnInit() {
    localStorage.removeItem('menuWatching');
    this.$menu = $('#navLeftMenu');

    this.userFavoriteMenuService.eventFavoriteMenu.subscribe(data => {
      this.menuFavorites = data
    })
    this.userFavoriteMenuService.GetListFavMenuByUser(this.loggedUser.company_id, this.loggedUser.user_cd).then(data => {
      // console.log('data',data)
      this.userFavoriteMenuService.favoriteMenus = data.data
      this.userFavoriteMenuService.eventFavoriteMenu.emit(this.userFavoriteMenuService.favoriteMenus)
    })
    this.programService.getOpenedPrograms
      .subscribe(
        (programs: Array<ProgramModel>) => {
          this.openedPrograms = programs;
          if (!this.openedPrograms.length || this.openedPrograms.length <= 0) {
            this.$menu.find("li.active").removeClass("active")
          }
        }
      );

    this.programService.programsClicked
      .subscribe(
        (id: any) => {
          this.$menu.find("li.active").removeClass("active")
          this.$menu.find("li[id=" + id + "]").addClass("active")

          setTimeout(() => {
            this.processLayout(this.layoutService.store);
          }, 10);
        }
      );

    this.programService.refreshOpenedPrograms();

    this.layoutService.isfixedNavigation
      .subscribe(
        (fixedNav: boolean) => {
          this.fixedNav = fixedNav;
        }
      );

    this.layoutService.isMenuOnTop
      .subscribe(
        (menuOnTop: boolean) => {
          this.isMenuOnTop = menuOnTop;
        }
      );

    this.getHierarchyMenus().then(data => {
      this.hierarchyMenu.push(...data);
      setTimeout(() => {
        this.processMenu()
      }, 10);
    })
  }

  private async getHierarchyMenus() {
    return new Promise<HierarchyMenuModel[]>(
      (resolve, reject) => {
        this.api.get("menu/btree/by-user").subscribe(data => {
          resolve(data.data);
        });
      }
    );
  }

  ngAfterViewInit() {
    this.programService.addAnimation();
  }
  progClicked(menuInfo: HierarchyMenuModel, el) {
    var url;
    if (!menuInfo.program_cd.startsWith('/')) {
      url = "/" + menuInfo.program_cd;
    }
    else {
      url = menuInfo.program_cd;
    }
    if (!this.programService.openedPrograms.filter(x => x.id == menuInfo.menu_id).length && this.programService.openedPrograms.length == config.maxOpenedPrograms) {
      this.notiService.smartMessageBox({
        title: "Notification",
        content: `Maximum ${config.maxOpenedPrograms} programs can be opened!`,
        buttons: '[OK]'
      });
      return;
    }
    $('.center-loading').show();
    //var name = this.i18nService.getTranslation(menuInfo.menu_name);
    this.programService.addOpenedPrograms(new ProgramModel(menuInfo.menu_id, menuInfo.menu_name, url));

    this.$menu.find("li.active").removeClass("active")
    $(el.target).parent().addClass("active");

    // this.userFavoriteMenuService.setMenuWatching(menuInfo)
  }

  RemoveFavoriteMenu(menu) {
    this.userFavoriteMenuModel = this.userFavoriteMenuService.initModel()
    this.userFavoriteMenuModel.company_id = this.loggedUser.company_id
    this.userFavoriteMenuModel.user_id = this.loggedUser.user_cd
    this.userFavoriteMenuModel.menu_id = menu.menu_id
    this.userFavoriteMenuService.DeleteMenu(this.userFavoriteMenuModel).then(data => {
      if (data.status > 0) {
        this.notificationService.showMessage("success", data.message);
        this.userFavoriteMenuService.removeFavoriteMenu(this.userFavoriteMenuModel)
      } else {
        this.notificationService.showMessage("error", data.message);
      }
    })
  }

  RemoveAllFavoriteMenu() {
    if (this.userFavoriteMenuService.favoriteMenus.length != 0) {
      console.log('this.userFavoriteMenuService.favoriteMenus', this.userFavoriteMenuService.favoriteMenus)
      this.userFavoriteMenuService.BatchDeleteMenu(this.userFavoriteMenuService.favoriteMenus).then(data => {
        if (data.status > 0) {
          this.notificationService.showMessage("success", data.message);
          this.userFavoriteMenuService.removeAllFavoriteMenu()
        } else {
          this.notificationService.showMessage("error", data.message);
        }
      })
    }
  }
  myMenuClicked(menuInfo, el) {
    if (!this.programService.openedPrograms.filter(x => x.id == menuInfo.menu_id).length && this.programService.openedPrograms.length == config.maxOpenedPrograms) {
      this.notiService.smartMessageBox({
        title: "Notification",
        content: `Maximum ${config.maxOpenedPrograms} programs can be opened!`,
        buttons: '[OK]'
      });
      return;
    }
    $('.center-loading').show();
    //var name = this.i18nService.getTranslation(menuInfo.menu_name);
    this.programService.addOpenedPrograms(new ProgramModel(menuInfo.menu_id, menuInfo.menu_name, menuInfo.program_cd));

    this.$menu.find("li.active").removeClass("active")
    this.$menu.find("li[id=" + menuInfo.menu_id + "]").addClass("active");
    setTimeout(() => {
      this.processLayout(this.layoutService.store);
    }, 100);
  }
  private processMenu() {
    this.$menu.find("li:has(> ul)").each((i, li) => {
      let $menuItem = $(li);
      let $a = $menuItem.find(">a");
      let sign = $(
        '<b class="collapse-sign"><em class="fa fa-plus-square-o"/></b>'
      );

      $a.on("click", e => {
        this.toggle($menuItem);
        e.stopPropagation();
        return false;
      }).append(sign);
    });

    setTimeout(() => {
      this.processLayout(this.layoutService.store);
    }, 100);
  }
  private processLayout = layoutStore => {
    if (layoutStore.menuOnTop) {
      this.$menu.find("li.open").each((i, li) => {
        this.toggle($(li), false);
      });
    } else {
      this.$menu.find("li.active").each((i, li) => {
        $(li)
          .parents("li")
          .each((j, parentLi) => {
            this.toggle($(parentLi), true);
          });
      });
    }

    if (layoutStore.mobileViewActivated) {
      $("body").removeClass("minified");
    }
  };

  private toggle($el, condition = !$el.data("open")) {
    $el.toggleClass("open", condition);

    if (condition) {
      $el.find(">ul").slideDown();
    } else {
      $el.find(">ul").slideUp();
    }

    $el
      .find(">a>.collapse-sign>em")
      .toggleClass("fa-plus-square-o", !condition)
      .toggleClass("fa-minus-square-o", condition);

    $el.data("open", condition);

    if (condition) {
      $el.siblings(".open").each((i, it) => {
        let sib = $(it);
        this.toggle(sib, false);
      });
    }
  }
}
