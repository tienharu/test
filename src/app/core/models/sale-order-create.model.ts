import { MainBaseModel } from "./main-base.model";
import { SaleOrderCreateDetailModel } from "./sale-order-create-detail.model";

export class SaleOrderCreateModel extends MainBaseModel {

companyId: number ;
salesOrderCd : string='' ;
salesOrderSeq : number = 0;
salesOrderNo : string='' ;
salesOrderNm : string='';
customerCd : string='';
bizUnitId : string='';
currencyGenCd : string='';
taxCodeGenCd :  string  = "316000000001";
stockUnitGenCd : string ='';
paymentTermGenCd : string ='';
deliveryYmd : string = '';
dueDateYmd : string = '';
receiveDateYmd : string = '';
times : number;
termGenCd : string = '';
orderAmount : number  = 111;
taxAmount: number = 222;
totalAmount : number = 10000;
cancelOrderYn :  boolean = false;
cancelYmd :  string  = '';
cancelReason  : string = '';
confirmedYmd : string = '';
finalOrderAmount : number = 777;
finalCost : number = 888;
finalOverhead : number = 999;
description : string = 'Chao dai ca';
useYn : boolean = true;
creator : string = '';
createdTime : string ='';
changer : string ='';
changedTime : string = '';
remark : string = '';
delYn  : boolean = false;
BmSalesOrderDetail : SaleOrderCreateDetailModel[] = [];
}

export class SalesOrderCreateItemizedModel {
    constructor(){
    }
    itemName: string;
    itemized:  string;
    unit: string;
    bizUnit: string;
}
