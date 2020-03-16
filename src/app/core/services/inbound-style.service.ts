import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "./notification.service";
import { Injectable } from "@angular/core";
import { PurchOrderHeaderModel } from "@app/core/models/purch-order-header.model";
import { InboundStyleHeaderModel } from "../models/inbound-style-header.model";
import { ReceivedDataInboundDetailModel } from "../models/inbound-style-detail.model";
import _ from 'lodash';

@Injectable()
export class InboundStyleService {
    private inboundStyleHeaderInfo: InboundStyleHeaderModel;
    private receivedDataInboundDetailModels: ReceivedDataInboundDetailModel[];
    private listColor: any;
    private listSize: any;
    private styleSysId: any;

    constructor(private api: CRMSolutionApiService,
        private notificationService: NotificationService) {
        this.inboundStyleHeaderInfo = new InboundStyleHeaderModel();
        this.receivedDataInboundDetailModels = new Array<ReceivedDataInboundDetailModel>();
        this.listColor = [];
        this.listSize = [];
        this.styleSysId = "";
    }

    getColor() {
        return this.listColor;
    }

    setColor(listColor: any) {
        this.listColor = listColor;
    }

    getSize() {
        return this.listSize;
    }

    setSize(listSize: any) {
        this.listSize = listSize;
    }

    getModel(): InboundStyleHeaderModel {
        return this.inboundStyleHeaderInfo;
    }

    setModel(inBoundModel: any) {
        this.inboundStyleHeaderInfo = inBoundModel;
    }

    resetModel() {
        this.inboundStyleHeaderInfo = new InboundStyleHeaderModel();
    }

    getReceivedData() {
        return this.receivedDataInboundDetailModels;
    }

    setReceivedData(objArr: any[]) {
        this.receivedDataInboundDetailModels = objArr.map(item => {
            return {
                styleInboundNo: item.styleInboundNo,
                woNo: item.woNo,
                stepSeq: item.stepSeq,
                colorId: item.colorId,
                sizeId: item.sizeId,
                woOrder: item.woOrder,
                received: item.recevied,
                inQty: item.inQty,
                remain: item.remain,
                price: item.price,
                amount: item.amount,
                remark: item.remark
            }
        });
    }

    getStyleSysId() {
        return this.styleSysId;
    }

    setStyleSysId(styleSysId: any) {
        this.styleSysId = styleSysId;
    }

    public listPurchOrderHeaderAll() {
        return new Promise<PurchOrderHeaderModel[]>((resolve, reject) => {
            this.api.get(`api/v1/order/purch-order-header`).subscribe(data => {
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }

    public searchWoNo(model: any) {
        return new Promise<any> ((resolve, reject) => {
            this.api.post(`api/v1/order/work-order-header/search`, model).subscribe(data => {
                if (data.length < 1) {
                    this.notificationService.showMessage("error", "Data not found!");
                    resolve([]);
                    return;
                } else {
                    this.notificationService.showMessage("success", data.length + " Data had found!");
                    resolve(data);
                }
            });
        });
    }

    public searchInboundStyleHeader(fromDate: any, toDate: any, styleInboundNo: any, woNo: any) {
        let objParam = {
            fromDate: fromDate,
            toDate: toDate,
            styleInboundNo: styleInboundNo || 0,
            WoNo: woNo || 0
        }
        return new Promise<any> ((resolve, reject) => {
            this.api.post(`api/v1/order/inbound-style-header/search`, objParam).subscribe(data => {
                if (data.length < 1) {
                    this.notificationService.showMessage("error", "Data not found!");
                    resolve([]);
                    return;
                } else {
                    this.notificationService.showMessage("success", data.length + " Data had found!");
                    resolve(data);
                }
            });
        });
    }

    public insertInboundStyle(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/inbound-style-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public updateInboundStyle(model) {
        return new Promise<any>((resolve, reject) => {
            this.api.put(`api/v1/order/inbound-style-header`, model).subscribe(data => {
                resolve(data);
            });
        });
    }

    public deleteInboundStyle(inboundStyleNo: any, styleSysId: any = '', itemIds: any = '') {
        let obj = {
            inboundStyleNo: inboundStyleNo,
            styleSysId: styleSysId,
            itemIds: itemIds
        }
        return new Promise<any>((resolve, reject) => {
            this.api.post(`api/v1/order/inbound-style-header`, obj).subscribe(data => {
                resolve(data);
            });
        });
    }

    public searchInboundStyleDetailByWonoSteqSeq(woNo: any, stepSeq: any) {
        let objParam = {
            WoNo: woNo,
            StepSeq: stepSeq
        }
        return new Promise<any[]>((resolve, reject) => {
            this.api.post(`api/v1/order/inbound-style-detail/search`, objParam).subscribe(data => {
                resolve(data);
            });
        });
    }

    public getCustomer() {
        return new Promise<any[]>((resolve, reject) => {
            this.api.get(`customer/suppliers`).subscribe(data => {     
                if (!data.success) {
                    this.notificationService.showMessage("error", data.message);
                    resolve([]);
                    return;
                }
                resolve(data.data);
            });
        });
    }
}