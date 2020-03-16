import { UserAuthorityGroupSettingModel } from "@app/core/models/user-authority-group-setting.model";

export class UserAuthorityGroupSettingService {
    private userAuthorityGroupSettingModel: UserAuthorityGroupSettingModel;

    constructor() {
        this.userAuthorityGroupSettingModel = new UserAuthorityGroupSettingModel();
    }

    getModel(): UserAuthorityGroupSettingModel {
        return this.userAuthorityGroupSettingModel;
    }

    storeTemporaryModel(userAuthorityGroupSettingModel: UserAuthorityGroupSettingModel) {
        this.userAuthorityGroupSettingModel = userAuthorityGroupSettingModel;
    }

    resetModel() {
        this.userAuthorityGroupSettingModel = new UserAuthorityGroupSettingModel();
    }
}