import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CanDeactivateGuard } from "@app/core/guards/can-deactivate-guard";
import { Observable } from "rxjs/Observable";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { ProgramList } from "@app/core/common/static.enum";
import { RocketChatService } from "@app/core/services/rocket-chat.service";
import { BasePage } from "@app/core/common/base-page";
import { AuthService, ProgramService } from "@app/core/services";
import { I18nService } from "@app/shared/i18n/i18n.service";

@Component({
  selector: "sa-rocket-chat",
  template: '<div id="content">' +
    '<iframe id="RocketChat" #iframe src="https://chat.atmandev.net/" width="100%" height="100%"></iframe>' +
    '</div>',
  styleUrls: ["./rocket-chat.component.css"]
})
export class RocketChatComponent extends BasePage implements OnInit, CanDeactivateGuard {
  @ViewChild('iframe') iframe: ElementRef;
  rocketUser: any = null;
  constructor(
    private api: CRMSolutionApiService,
    private notification: NotificationService,
    private rocketChatService: RocketChatService,
    public programService: ProgramService,
    public userService: AuthService,
    private i18nService: I18nService
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Rocket_Chat.valueOf())
    this.rocketUser = this.rocketChatService.getRocketUserInfo();
  }

  ngAfterViewInit() {
    var self = this;
    self.notification.showCenterLoading();
    var rktChatFrame = this.iframe.nativeElement.contentWindow;//document.getElementById('RocketChat').contentWindow;
    window.addEventListener("message", function (event) {
      window.parent.postMessage(event.data, '*');
      if(event.data.event === 'login-error'){
        //handle login again
      }
    });
    if (!!rktChatFrame && self.rocketUser) {
      setTimeout(function () {
        rktChatFrame.postMessage({
          event: 'login-with-token',
          loginToken: self.rocketUser.authToken
        }, '*');
        self.notification.hideCenterLoading();
      }, 5000);
    } else {
      console.log("Messenger Frame not found!");
    }
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
