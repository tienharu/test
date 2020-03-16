import { UserModel } from "@app/core/models/user.model";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";

@Injectable()
export class UserMasterService {
    private userMasterInfo: UserModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.userMasterInfo = new UserModel();
    }

    getModel(): UserModel {
        return this.userMasterInfo;
    }

    storeTemporaryModel(userMasterInfo: UserModel) {
        this.userMasterInfo = userMasterInfo;
    }

    resetModel() {
        this.userMasterInfo = new UserModel();
    }

    //login company users
    public listUsers() {
        return new Promise<UserModel[]>((resolve, reject) => {
          this.api
            .get(`/user/list`)
            .subscribe(data => {
              if (!data.success) {
                this.notificationService.showMessage("error", data.data.message);
                resolve([]);
                return;
              }
              resolve(data.data);
            });
        });
      }
}