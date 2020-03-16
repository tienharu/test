import { Component, OnInit, ViewChild } from '@angular/core';
import { RecentProjectsService } from '@app/shared/layout/header/recent-projects/recent-projects.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NewsModel } from '@app/core/models/news.model';
import { NewsService } from '@app/core/services/features.services/news.service';
import { AuthService } from '@app/core/services';
import { BasePage } from '@app/core/common/base-page';

@Component({
  selector: 'sa-latest-news',
  templateUrl: './latest-news.component.html',
  providers: [RecentProjectsService]
})
export class LatestNewsComponent extends BasePage implements OnInit {

  projects: Array<any>;
  title: String="No data";
  count: number = 0;
  modalRef: BsModalRef;
  NewsInfo: NewsModel = new NewsModel();
  NewsList: NewsModel[] = [];

  @ViewChild("popupNewInfoData") popupNewInfoData;

  constructor(private projectsService: RecentProjectsService,
    private modalService: BsModalService,
    private NewsService: NewsService,
    public userService: AuthService,
  ) {
    super(userService);
  }

  ngOnInit() {
    // this.projects = this.projectsService.getProjects();
    // this.title = this.projects[0].title;
    // this.count = this.projects.length;
    this.NewsInfo.company_id = this.companyInfo.company_id;
    this.getListNews().then(data => {
      this.NewsList.push(...data)
      if (this.NewsList.length > 0) {
        this.title = this.NewsList[0].title;
        this.count = this.NewsList.length;
      }
    })
    this.animateNews()

  }

  getListNews() {
    return this.NewsService.listNewsHeader(this.NewsInfo.company_id);
  }
  animateNews() {
    var i = 0;
    if(this.NewsList.length && this.NewsList.length>0){
      setInterval(() => {
        i++;
        if (i >= this.NewsList.length) {
          i = 0;
        }
        this.title = this.NewsList[i].title;
        $('.hot-news').addClass('animated flash faster').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend',
          function () {
            $(this).removeClass('animated flash faster');
          });
      }, 3000)
    }
    
  }

  openNewInfoPopup(news) {
    setTimeout(() => {
      this.NewsInfo = news;
      let config = {
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true
      };
      this.modalRef = this.modalService.show(this.popupNewInfoData, config);
    }, 100);
  }

  closeNewInfoPopup() {
    this.modalRef && this.modalRef.hide();
  }
}