import { Component, ViewChild, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, NotificationService, ProgramService, CRMSolutionApiService, LayoutService } from "@app/core/services";
import { SearchingService } from "@app/core/services/searching.service";
import { BasePage } from "@app/core/common/base-page";
import { SearchingModel, SearchResultGroupByConvertedModel, } from "@app/core/models/searching.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { HierarchyMenuModel } from "@app/core/models/hierarchy-menu.model";
import { ProgramModel } from "@app/core/models/program.model";
import { config } from "@app/core/smartadmin.config";

import * as _ from 'lodash'
import "mark.js/dist/jquery.mark.min.js"
import "script-loader!smartadmin-plugins/datatables/datatables.min.js";
@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent extends BasePage implements OnInit {
  state: any = {}
  @Input() keyword: string
  searchResults: SearchingModel[]
  searchResultGroupBy: any
  searchResultGroupByConverted: SearchResultGroupByConvertedModel[] = []
  searchResultOfMenu: SearchingModel[] = []
  hierarchyMenu: HierarchyMenuModel[] = [];

  $menu: any;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    public userService: AuthService,
    private notificationService: NotificationService,
    private searchingService: SearchingService,
    public programService: ProgramService,
    private modalService: BsModalService,
    private api: CRMSolutionApiService,
    private notiService: NotificationService,
    private layoutService: LayoutService,


  ) {
    super(userService);
  }
  ngOnInit() {
    this.$menu = $('#navLeftMenu');

    this.groupByResultSearch()
  }

  loadSearchResults() {
    // console.log('this.searchResult', this.loggedUser)
    $('.center-loading').css('left', '46%')
    $('.center-loading').show();
    return this.searchingService.getResultSearchDapper(this.loggedUser.company_id, this.loggedUser.user_cd, this.keyword).then(data => {
      $('.center-loading').hide();
      this.searchResults = data.data
    })
  }

  groupByResultSearch() {
    Promise.all([this.loadSearchResults(), this.getHierarchyMenus()]).then(s => {
      this.searchResultGroupBy = _.groupBy(this.searchResults, function (c) {
        return c.menu_id
      })
      this.convertResultSearchGroupBy()
    })
  }

  convertResultSearchGroupBy() {
    for (let pro in this.searchResultGroupBy) {
      let item = new SearchResultGroupByConvertedModel()
      item.menu_id = pro
      item.result_search_of__menu = this.searchResultGroupBy[pro]
      item.count_result = this.searchResultGroupBy[pro].length
      this.searchResultGroupByConverted.push(item)
    }
    this.assignMenuNameToList(this.searchResultGroupByConverted)
    // console.log('this.searchResultGroupByConverted', this.searchResultGroupByConverted)
  }

  assignMenuNameToList(arr) {
    for (let level1 of this.hierarchyMenu) {
      for (let level2 of level1.nodes) {
        for (let level3 of level2.nodes) {
          for (let item of arr) {
            if (level3.menu_id == item.menu_id) {
              item.menu_name = level3.menu_name
              item.program_cd = level3.program_cd
            }
          }
        }
      }
    }
  }

  loadSearchResultOfMenu(menu) {
    for (let item of this.searchResultGroupByConverted) {
      if (item.menu_id == menu.menu_id) {
        item.isActiveTab = true
        this.searchResultOfMenu = item.result_search_of__menu
        for (let item2 of this.searchResultOfMenu) {
          item2.menu_name = item.menu_name
          item2.program_cd = item.program_cd
          item2.data_content_splited = item2.data_content.split('|')
          _.remove(item2.data_content_splited, c => c == "")
          item2.data_content_splited = _.uniq(item2.data_content_splited)
        }
      }
      else
        item.isActiveTab = false
    }
    // console.log('searchResultOfMenu', this.searchResultOfMenu)
    this.highlightKeywordOnPopup(this.keyword)
  }

  openPage(menuInfo, keyword) {
    // console.log('keyword', keyword)
    // $('#keyword').val(keyword)
    this.separateCodeOfOpenPage(menuInfo)
    this.closePoppupSearch()
    this.searchingService.stopIntervalHighLight()
    this.highlightKeywordOnIframe(menuInfo.menu_id, keyword)
  }

  highlightKeywordOnPopup(keyword) {
    setTimeout(() => {
      let options = {
        separateWordSearch: false,
      }
      $(".data_content").unmark({
        done: function () {
          $(".data_content").mark(keyword.trim().toLowerCase(), options);
        }
      });
      $(".created").unmark({
        done: function () {
          $(".created").mark(keyword.trim().toLowerCase(), options);
        }
      });
    }, 20);
  }

  highlightKeywordOnIframe(menuId, keyword) {
    // console.log('element123', menuInfo.data_content)
    let idInterval = setInterval(() => {
      let options = {
        separateWordSearch: false,
        // filter: function (node) {
        //   if (node.data.trim() == keyword.trim())
        //     return true
        // }
      }
      let element = $(`#page #${menuId}`).contents()
      element.unmark({
        done: function () {
          element.mark(keyword.trim(), options);
          // let table = element.find('#DataTables_Table_0').DataTable()
          // element.find('#DataTables_Table_0').DataTable().search(keyword.trim()).draw()
          // console.log('data', table.rows().data())
        }
      })
    }, 500)
    localStorage.setItem("idInterval", idInterval.toString());
  }

  //#region function seldom edit
  getHierarchyMenus() {
    return new Promise<HierarchyMenuModel[]>(
      (resolve, reject) => {
        this.api.get("menu/btree/by-user").subscribe(data => {
          resolve(data.data);
        });
      }
    ).then(data => {
      this.hierarchyMenu.push(...data);
      // console.log('this.hierarchyMenu', this.hierarchyMenu)
    });
  }

  separateCodeOfOpenPage(menuInfo) {
    if (!this.programService.openedPrograms.filter(x => x.id == menuInfo.menu_id).length && this.programService.openedPrograms.length == config.maxOpenedPrograms) {
      this.notiService.smartMessageBox({
        title: "Notification",
        content: `Maximum ${config.maxOpenedPrograms} programs can be opened!`,
        buttons: '[OK]'
      });
      return;
    }

    $('.center-loading').show();
    this.programService.addOpenedPrograms(new ProgramModel(menuInfo.menu_id, menuInfo.menu_name, menuInfo.program_cd))
    this.$menu.find("li.active").removeClass("active")
    this.$menu.find("li[id=" + menuInfo.menu_id + "]").addClass("active");
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
  }

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

  closePoppupSearch() {
    this.modalService.hide(1)
    // document.documentElement.scrollTop = 0;
    document.documentElement.style.overflowY = 'scroll'
  }

  //#endregion 
}
