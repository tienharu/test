import { AuthorityGroupMenuSettingModel } from "@app/core/models/authority-group-menu-setting.model";

export class AuthorityGroupMenuSettingService {
    private authorityGroupMenuInfo: AuthorityGroupMenuSettingModel;

    constructor() {
        this.authorityGroupMenuInfo = new AuthorityGroupMenuSettingModel();
    }

    getModel(): AuthorityGroupMenuSettingModel {
        return this.authorityGroupMenuInfo;
    }

    storeTemporaryModel(authorityGroupMenuInfo: AuthorityGroupMenuSettingModel) {
        this.authorityGroupMenuInfo = authorityGroupMenuInfo;
    }

    resetModel() {
        this.authorityGroupMenuInfo = new AuthorityGroupMenuSettingModel();
    }
}