import { MainBaseModel } from "./main-base.model";
export class ProcessFlowPathRouteModel extends MainBaseModel {
    companyId: number = 0;
    processFlowId: string;
    processPathId: string;
    processPathRouteId: string;
    routeId: string;
    processflowUkId: number;
    pathOrderSeq: string;
    capacityHourly: number;
    completenessDegree: number;
    controlPointYn: boolean = false;
    ccrYn: boolean  = false;
    itemizedGenCd: string = '';
    id:string;
}