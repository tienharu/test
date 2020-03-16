import { PositionModel } from '@app/core/models/position.model';

export class PositionMasterService {
    private positionMasterInfo: PositionModel;

    constructor() {
        this.positionMasterInfo = new PositionModel();
    }

    getModel(): PositionModel {
        return this.positionMasterInfo;
    }

    storeTemporaryModel(positionMasterInfo: PositionModel) {
        this.positionMasterInfo = positionMasterInfo;
    }

    resetModel() {
        this.positionMasterInfo = new PositionModel();
    }
}