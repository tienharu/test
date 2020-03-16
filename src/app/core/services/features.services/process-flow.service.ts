import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "../notification.service";
import { Injectable } from "@angular/core";
import { ProcessFlowHeaderModel } from '@app/core/models/process-flow-header-model';
import { ProcessFlowPathModel } from '@app/core/models/process-flow-path-model';
import { ProcessFlowPathRouteModel } from '@app/core/models/process-flow-path-route-model';
@Injectable()
export class ProcessFlowMasterService {
    private processFlowHeader: ProcessFlowHeaderModel;
    private processFlowPath: ProcessFlowPathModel;
    private processFlowPathRoute: ProcessFlowPathRouteModel;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.processFlowHeader = new ProcessFlowHeaderModel();
        this.processFlowPath = new ProcessFlowPathModel();
        this.processFlowPathRoute = new ProcessFlowPathRouteModel();
    }

    getProcessFlowModel(): ProcessFlowHeaderModel {
        return this.processFlowHeader;
    }

    getProcessPathModel(): ProcessFlowPathModel {
        return this.processFlowPath;
    }

    getProcessPathRouteModel(): ProcessFlowPathRouteModel {
        return this.processFlowPathRoute;
    }

    storeProcessFlowModel(processFlowHeader: ProcessFlowHeaderModel) {
        this.processFlowHeader = processFlowHeader;
    }

    storeProcessPathModel(processFlowPath: ProcessFlowPathModel) {
        this.processFlowPath = processFlowPath;
    }

    storeProcessPathRouteModel(processFlowPathRoute: ProcessFlowPathRouteModel) {
        this.processFlowPathRoute = processFlowPathRoute;
    }

    resetProcessFlowModel() {
        this.processFlowHeader = new ProcessFlowHeaderModel();
    }

    resetProcessPathModel() {
        this.processFlowPath = new ProcessFlowPathModel();
    }

    resetProcessPathRouteModel() {
        this.processFlowPathRoute = new ProcessFlowPathRouteModel();
    }


    public getAllProcessFlow(pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/mas_process_header/pageindex=${page}&pagesize=${pagesize}`)
            .subscribe(data => {
                resolve(data);
                return;
            });
        });
    }

    public getAllProcessFlow2(pagesize, page) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/mas_process_header/simple/pageindex=${page}&pagesize=${pagesize}`)
            .subscribe(data => {
                resolve(data.data);
                console.log("ss",data.data);
                return;
            });
        });
    }

    public getProcessFlow(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/mas_process_header/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public insertProcessFlow(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_process_header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateProcessFlow(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_process_header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updatePartialProcessFlow(id, model) {
        return new Promise<any>((resolve, reject) => {
            this.api.patch(`api/v1/mas_process_header/${id}`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteProcessFlow(id: number) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_process_header/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getPathRouteByPathId(pathId){
        return new Promise<any>((resolve, reject) => {
            this.api.get(`api/v1/mas_process_route/path/${pathId}`)
            .subscribe(data => {
                resolve(data);
                return;
            });
        });
    }

    public insertPathRoute(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/mas_process_route`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updatePathRoute(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/mas_process_route`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deletePathRoute(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_process_route/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deletePath(id) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete(`api/v1/mas_process_path/${id}`).subscribe(data => {
                resolve(data);
            });
        });
    }
}