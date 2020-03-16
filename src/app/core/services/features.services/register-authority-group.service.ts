import { AuthorityGroupModel } from "@app/core/models/authority-group.model";

export class RegisterAuthorityGroupService {
    private registerAuthorityGroupModel: AuthorityGroupModel;

    constructor() {
        this.registerAuthorityGroupModel = new AuthorityGroupModel();
    }

    getModel(): AuthorityGroupModel {
        return this.registerAuthorityGroupModel;
    }

    storeTemporaryModel(registerAuthorityGroupModel: AuthorityGroupModel) {
        this.registerAuthorityGroupModel = registerAuthorityGroupModel;
    }

    resetModel() {
        this.registerAuthorityGroupModel = new AuthorityGroupModel();
    }
}