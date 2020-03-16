import { MainBaseModel } from "./main-base.model";
import { MateriaMasterlModel } from "./material-master.model";

export class MaterialMasterPopupModel extends MainBaseModel {
bmMasPurchMasterCd : string = '';
materialCd : string ='';
companyId: number ;
customerCd : string ='';
procureTypeGenCd: string ='';
purchPrice : number;
packingUnitQty : number;
lossRatio : number ;
minPoQty : number ;
leadTimeDays : number ;
useYn : boolean = true;
creator : string = '';
createdTime : string ='';
changer : string ='';
changedTime : string = '';
remark : string = '';
delYn  : boolean = false;
masMaterial: MateriaMasterlModel = new MateriaMasterlModel;
}
