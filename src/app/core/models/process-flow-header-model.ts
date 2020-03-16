import { MainBaseModel } from "./main-base.model";
import { ProcessFlowPathModel } from '@app/core/models/process-flow-path-model';

export class ProcessFlowHeaderModel extends MainBaseModel {
    companyId: number = 0;
    processflowId: string;
    processflowNm: string = '';
    itemCateGenCd: string = '';
    stockUnitGenCd: string = '';
    headerSeq: number;
    workStartTime: string = '';
    workFinishTime: string = '';
    inputStatus: boolean = false;
    startRouteId: number;
    finalRouteId: number;
    ccrRouteId: number;
    totalRouteCount: number = 0;
    completenessDegree: number = 0;
    processFlowDiagram: string;
    createTime: string='';
    bmMasProcessflowPath: ProcessFlowPathModel[] = [];
}


