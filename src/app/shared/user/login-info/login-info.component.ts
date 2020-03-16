import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LayoutService } from '@app/core/services/layout.service';
import { AuthService, NotificationService } from '@app/core/services';

declare var $: any;

@Component({

	selector: 'sa-login-info',
	templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {
	user: any;

	constructor(
		private userService: AuthService,
		private layoutService: LayoutService,
		private router: Router,
		private notificationService: NotificationService) {
	}

	ngOnInit() {
		this.user = this.userService.getUserInfo();
	}

	toggleShortcut() {
		this.layoutService.onShortcutToggle();
	}

	showPopup() {
		this.notificationService.smartMessageBox({
			title: 
				"<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('.top-user-profile a.username span').text() + "</strong></span> ?",
			content: "Do you want to logout?",
			buttons: '[No][Yes]'

		}, (ButtonPressed) => {
			if (ButtonPressed == "Yes") {
				this.logout();
			}
		});
	}

	logout() {
		this.router.navigate(['/auth/login']);
	}
}
