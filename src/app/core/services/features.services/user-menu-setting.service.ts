import { UserMenuModel } from "@app/core/models/user-menu.model";

export class UserMenuSettingService {
    private userMenuSettingModel: UserMenuModel;

    constructor() {
        this.userMenuSettingModel = new UserMenuModel();
    }

    getModel(): UserMenuModel {
        return this.userMenuSettingModel;
    }

    storeTemporaryModel(userMenuSettingModel: UserMenuModel) {
        this.userMenuSettingModel = userMenuSettingModel;
    }

    resetModel() {
        this.userMenuSettingModel = new UserMenuModel();
    }
}