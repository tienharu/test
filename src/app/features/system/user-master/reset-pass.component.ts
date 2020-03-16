import { OnInit, Component, Input } from "@angular/core";
import { CRMSolutionApiService, NotificationService } from "@app/core/services";
import { ResetPassModel } from "@app/core/models/user.model";

@Component({
  selector: "sa-reset-pass",
  templateUrl: "./reset-pass.component.html"
})
export class ResetUserPasswordComponent implements OnInit {
  @Input()
  userId: any;
  @Input()
  userName: any;
  model:ResetPassModel=new ResetPassModel();

  public resetValidationOptions:any= {
    rules: {
      password: {
        required: true
      },
      confirm_password:{
        required: true,
        equalTo: "#newPass"
      }
    },
    messages: {
      password: {
        required: "Please enter new password"
      },
      confirm_password: {
        required: "Please confirm password",
        equalTo:"Confirm password is not match"
      },
    }
  };
  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService){
    
  }
  
  ngOnInit(): void {
    if(!this.userId){
      this.notification.showMessage("error","UserID is not valid, please close & re-open")
    }
    this.model.user_id=this.userId;
    this.model.user_nm=this.userName;
  }

  onSubmit() {
    console.log( this.model)
    if(this.model.password!=this.model.confirm_password){
      this.notification.showMessage("error", "Confirm password is not match");
      return;
    }
    this.api.post("user/reset", this.model).subscribe(data => {
      if (!data.success) {
        this.notification.showMessage("error", data.data.message);
      } else {
        this.notification.showMessage("success", data.data.message);
      }
    });
  }
}
