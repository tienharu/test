import { BasePage } from "@app/core/common/base-page";
import { OnInit, Input, Component } from "@angular/core";
import { GeneralMasterService } from "@app/core/services/features.services/general-master.service";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap";
import { I18nService } from "@app/shared/i18n/i18n.service";
import { AuthService, NotificationService } from "@app/core/services";
import { NewsModel } from "@app/core/models/news.model";
import { NewsService } from "@app/core/services/features.services/news.service";

@Component({
    selector: 'sa-info-news',
    templateUrl: './info-news.component.html',
    styleUrls: ['./info-news.component.css']
})

export class InfoNewsDataComponent extends BasePage implements OnInit {
    NewsInfo : NewsModel = new NewsModel();
    //@Input() newsJson: string;
    @Input() comId: number;
    @Input() newsId: number;
    
    ngOnInit() {
        // this.NewsInfo = JSON.parse(this.newsJson);
        // this.getNewsDetail();
        this.NewsService.getDetailNews(this.comId,this.newsId).then(data=>{
            this.NewsInfo = data;
            console.log(this.NewsInfo)
        });
    }

    constructor(
      
        private generalMasterService: GeneralMasterService,
        public userService: AuthService,
        private i18nService: I18nService,
        private NewsService: NewsService
    ) {
        super(userService);
    }

    getNewsDetail(){
        
    }
}