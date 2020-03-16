import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "@app/core/services/auth.service";
import { RocketChatService } from "@app/core/services/rocket-chat.service";

import { AuthUserModel } from "@app/core/models/auth_user.model";
import { NotificationService } from "@app/core/services/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  model: AuthUserModel;
  submitted = false;
  loginSuccess: boolean = false;
  errMessage: string = '';
  returnUrl: string;
  loggedUser: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private rocketChatService: RocketChatService,
    private notification: NotificationService,
    public userService: AuthService) {
    this.model = new AuthUserModel("", "");
  }

  ngOnInit() {
    //reset login status
    this.authService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    var self = this;
    this.errMessage = '';
    this.submitted = true;
    this.loading = true;
    this.authService.login(this.model.username, this.model.password).subscribe(data => {
      this.loading = false;
      if (data.status) {
        this.loggedUser = this.userService.getUserInfo();
        //self.rocketChatService.login('tien1', '1qaz!QAZ').subscribe((rocket) =>{});
        // self.rocketChatService.login(this.model.username, this.model.password).subscribe((rocket) =>{
        //   if (!rocket.status) {
        //     self.rocketChatService.register({
        //       username: this.model.username, 
        //       email: this.model.username + "@atmandev.net", 
        //       pass: this.model.password, 
        //       name: this.loggedUser.full_name,
        //       newPassword: "",
        //       currentPassword: ""
        //     }).subscribe((result) => {
        //       if (result.status) {
        //         self.rocketChatService.login(this.model.username, this.model.password).subscribe((rs) => {});
        //       }
        //     })
        //   }
        // });
        this.router.navigate([this.returnUrl]);
      }
      else {
        this.errMessage = data.message;
        this.notification.showMessage('error', this.errMessage)
      }
    });
  }
}
