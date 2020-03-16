import { Component, OnInit } from '@angular/core';
import { CRMSolutionApiService, NotificationService } from '@app/core/services';
import { ChangePassModel } from '@app/core/models/user.model';
import { RocketChatService } from '@app/core/services/rocket-chat.service';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'sa-change-pass',
  templateUrl: './change-pass.component.html'
})
export class ChangePassComponent implements OnInit {
  model: ChangePassModel = new ChangePassModel();
  rocketUser: any = null;
  public resetValidationOptions: any = {
    rules: {
      password: {
        required: true
      },
      new_password: {
        required: true
      },
      confirm_password: {
        required: true,
        equalTo: "#newPass"
      }
    },
    messages: {
      password: {
        required: "Please enter current password"
      },
      new_password: {
        required: "Please enter new password"
      },
      confirm_password: {
        required: "Please confirm password",
        equalTo: "Confirm password is not match"
      },
    }
  };
  constructor(private api: CRMSolutionApiService,
    private rocketChatService: RocketChatService,
    private modalService: BsModalService,
    private notification: NotificationService) {

  }

  ngOnInit(): void {
    this.rocketUser = this.rocketChatService.getRocketUserInfo();

  }

  onSubmit() {
    var obj = {
      "email": this.rocketUser.me.username + "@atmandev.net",
      "newPassword": this.model.new_password,
      "currentPassword": this.model.password,
      "username": this.rocketUser.me.username,
      "name": this.rocketUser.me.name
    };
    this.rocketChatService.update(obj).subscribe(data => {
      if (!data.status) {
         this.notification.showMessage("error",data.message);
      }
      else {
        this.api.post("user/change-pw", this.model).subscribe(data => {
          if (!data.success) {
             this.notification.showMessage("error", data.data.message);
          } else {
             this.notification.showMessage("success", data.data.message);
             this.modalService.hide(1);
          }
        });
      }
    });

  }

}
