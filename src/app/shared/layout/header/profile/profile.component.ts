import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from '@app/core/services/auth.service';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap";
import { NotificationService } from "@app/core/services";
@Component({
  selector: "sa-profile-menu",
  templateUrl: "./profile.component.html"
})
export class ProfileComponent {
  @ViewChild("tplChangePass")  tplChangePass;
  @ViewChild("tplProfileInfo")  tplProfileInfo;
  user: any;
  constructor(
    private router: Router,
		private notificationService: NotificationService,
    private userService: AuthService,
    private modalService: BsModalService
  ) {}
  modalRef: BsModalRef;
  ngOnInit() {
    this.user = this.userService.getUserInfo();
  }
  openChangePassModal() {
    this.modalRef = this.modalService.show(this.tplChangePass);
  }
  closeChangePassModal() {
    this.modalRef && this.modalRef.hide();
  }
  openProfileModal() {
    let config = {
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.tplProfileInfo,config);
  }
  closeProfileModal() {
    this.modalRef && this.modalRef.hide();
  }
  logoutPopup() {
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
}
