import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/core/services/notification.service";

declare var $: any;

@Component({
	selector: "sa-logout",
	template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent hidden-xs hidden-sm pull-right">
	<span> <a routerlink="/auth/login" title="Sign Out" data-action="userLogout"
			  data-logout-msg="Do you want to logout?"><i
	  class="fa fa-sign-out"></i></a> </span>
</div>
  `,
	styles: []
})
export class LogoutComponent implements OnInit {

	public user

	constructor(
		private router: Router,
		private notificationService: NotificationService
	) {
	}

	showPopup() {
		this.notificationService.smartMessageBox(
			{
				title:
					"<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('.user-top-info span').text() + "</strong></span> ?",
				content: "Do you want to logout this account?",
				buttons: "[No][Yes]"
			},
			ButtonPressed => {
				if (ButtonPressed == "Yes") {
					this.logout();
				}
			}
		);
	}

	logout() {
		this.router.navigate(["/auth/login"]);
	}

	ngOnInit() { }
}
