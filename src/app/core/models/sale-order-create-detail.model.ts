import { MainBaseModel } from "./main-base.model";
import { SaleOrderCreateModel } from "./sale-order-create.model";

export class SaleOrderCreateDetailModel extends MainBaseModel {
    salesOrderDetailCd: string = '';
    salesOrderDetailSeq:number = 0;
    salesOrderCd:string = '';
    companyId : number = 0;
    salesOrderDetailNo : string = '';
    deliveryYmd : string = '';
    po : number = 0;
    poNo : string = '';
    destination: string='';
    itemNm : string='';
    itemizedGenCd : string='';
    stockUnitGenCd :  string='';
    bizUnitId : string='';
    orderQty :  number = 0;
    price :  number = 0;
    orderAmount: number = 0;
    dueDateYmd : string='';
    mpsYn : boolean = true;
    useYn : boolean = true;
    creator : string = '';
    createdTime : string ='';
    changer : string ='';
    changedTime : string = '';
    remark : string = '';
    delYn  : boolean = false;
 }
