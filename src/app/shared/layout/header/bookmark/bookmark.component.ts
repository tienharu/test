import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@app/core/services/layout.service';
import { AuthService, ProgramService, NotificationService } from '@app/core/services';
import { ProgramModel } from '@app/core/models/program.model';
import { HierarchyMenuModel } from '@app/core/models/hierarchy-menu.model';
import { Router } from '@angular/router';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { UserFavoriteMenuService } from '@app/core/services/user-favorite-menu.service';
import { UserFavoriteMenuModel } from '@app/core/models/user.model';
import { BasePage } from '@app/core/common/base-page';


@Component({
  selector: 'sa-bookmark',
  templateUrl: './bookmark.component.html'
})
export class BookmarkComponent extends BasePage {
  userFavoriteMenuModel: UserFavoriteMenuModel
  constructor(
    private router: Router,
    private i18nService: I18nService,
    private userFavoriteMenuService: UserFavoriteMenuService,
    public userService: AuthService,
    private notificationService: NotificationService,
    public programService: ProgramService,


  ) {
    super(userService);

  }

  onBookmark() {
    let menu = this.programService.getCurrentProgram()
    if (menu == null) {
      return
    }
    this.userFavoriteMenuModel = this.userFavoriteMenuService.initModel()
    this.userFavoriteMenuModel.company_id = this.loggedUser.company_id
    this.userFavoriteMenuModel.user_id = this.loggedUser.user_cd
    this.userFavoriteMenuModel.menu_id = menu.id
    this.userFavoriteMenuModel.menu_name = menu.name
    this.userFavoriteMenuModel.program_cd = menu.url
    let isMenuAlready = this.userFavoriteMenuService.checkMenuAlready(menu.id)
    // console.log('isMenuAlready', isMenuAlready)
    if (!isMenuAlready) {
      this.userFavoriteMenuService.addMenuToSever(this.userFavoriteMenuModel).then(data => {
        if (data.status > 0) {
          this.notificationService.showMessage("success", data.message);
          this.userFavoriteMenuService.addFavoriteMenu(this.userFavoriteMenuModel)
        } else {
          this.notificationService.showMessage("error", data.message);
        }
      })
    }
  }
}
