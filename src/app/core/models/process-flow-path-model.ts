import { MainBaseModel } from "./main-base.model";
import { ProcessFlowPathRouteModel} from '@app/core/models/process-flow-path-route-model';

export class ProcessFlowPathModel extends MainBaseModel {
    companyId: number = 0;
    processFlowId: string;
    processPathId: string;
    processPathNm: string = '';
    pathUkId: number;
    processStepNo: number;
    bmMasProcessflowPathRoute: ProcessFlowPathRouteModel[] = [];
    id:string;
}

