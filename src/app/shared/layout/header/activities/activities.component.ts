import { Component, OnInit, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { ActivitiesService } from "@app/shared/layout/header/activities/activities.service";
import { ProgramService } from '@app/core/services/program.service';
import { ProgramList } from '@app/core/common/static.enum';
import { ProgramModel } from '@app/core/models/program.model';
import { HierarchyMenuModel } from '@app/core/models/hierarchy-menu.model';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { SystemMenuModel } from '@app/core/models/system-menu.model';
import { config } from "@app/core/smartadmin.config";
import { NotificationService } from '@app/core/services/notification.service';
import { RocketChatService } from '@app/core/services/rocket-chat.service';
import * as _ from "lodash";
import { CommonFunction } from '@app/core/common/common-function';
import { ContactorLessModel } from '@app/core/models/crm/expenses-magt.model';
declare var $: any;

@Component({
  selector: 'sa-activities',
  templateUrl: './activities.component.html',
  providers: [ActivitiesService],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  count: number = 0;
  lastUpdate: any;
  active: boolean;
  activities: any;
  currentActivity: any;
  loading: boolean;
  id: string = '';
  interval: any;
  //private $menu: any;
  private openedPrograms: Array<ProgramModel> = [];
  private rocketChatSocket = new WebSocket("wss://chat.atmandev.net/websocket");
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private activitiesService: ActivitiesService,
    private programService: ProgramService,
    private api: CRMSolutionApiService,
    private notiService: NotificationService,
    private rocketChatService: RocketChatService
  ) {
    this.active = false;
    this.loading = false;
    this.activities = [];
    this.count = 0;
    this.lastUpdate = new Date();
    this.id = CommonFunction.generateId();
  }

  ngOnInit() {
    var self = this;
    window.addEventListener("message", function (event) {
      if(event && event.data && event.data.eventName === 'unread-changed'){
         var count = parseInt(event.data.data);
         if(isNaN(count)){
           count = 0;
         }
         self.count = count;
      }
    });
    //this.$menu = $('#navLeftMenu');
    // this.activitiesService.getActivities().subscribe(data=> {
    //   this.activities = data;
    //   this.count = data.reduce((sum, it)=> sum + it.data.length, 0);
    //   this.currentActivity = data[0];
    // });
    // this.getMessageUnread();
  }
  
  setActivity(activity) {
    this.currentActivity = activity;
  }

  private getMessageUnread() {
    var self = this;
    self.rocketChatService.unreadMessage().then(data => {
      if(data && data.update && data.update.length > 0){
        self.count = _.sumBy(data.update, 'unread');
      }
    });
  }

  private documentSub: any;
  onToggle() {
    let dropdown = $('.ajax-dropdown', this.el.nativeElement);
    this.active = !this.active;
    if (this.active) {
      dropdown.fadeIn()


      this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          dropdown.fadeOut();
          this.active = false;
          this.documentUnsub()
        }
      });


    } else {
      dropdown.fadeOut()

      this.documentUnsub()
    }
  }

  onClickNotification() {
    var self = this;
    self.getMenuById(ProgramList.Rocket_Chat.valueOf()).then(data => {
      var url;
      if (!data[0].program_cd.startsWith('/')) {
        url = "/" + data[0].program_cd;
      }
      else {
        url = data[0].program_cd;
      }
      if (!this.programService.openedPrograms.filter(x => x.id == data[0].menu_id).length && this.programService.openedPrograms.length == config.maxOpenedPrograms) {
        this.notiService.smartMessageBox({
          title: "Notification",
          content: `Maximum ${config.maxOpenedPrograms} programs can be opened!`,
          buttons: '[OK]'
        });
        return;
      }
      $('.center-loading').show();
      this.programService.addOpenedPrograms(new ProgramModel(data[0].menu_id, data[0].menu_name, url));
      // this.programService.ActiveMenu(element2.menu_id);
      // this.$menu.find("li.active").removeClass("active")
      // this.$menu.find("li[id="+element2.menu_id+"]").addClass("active")
      return;
    });
  }

  update() {
    this.loading = true;
    setTimeout(() => {
      this.lastUpdate = new Date()
      this.loading = false
    }, 1000)
  }


  ngOnDestroy() {
    this.documentUnsub()
    // this.interval.clear();
  }

  documentUnsub() {
    this.documentSub && this.documentSub();
    this.documentSub = null
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

  private async getMenuById(menuId: any) {
    return new Promise<any[]>(
      (resolve, reject) => {
        this.api.get(`Menu/details/${menuId}`).subscribe(data => {
          console.log("menu data", data);
          resolve(data.data);
        });
      }
    );
  }

}
