import { MainBaseModel } from "./main-base.model";
import { MateriaMasterlModel } from "./material-master.model";
import { BaseModelWithSharingData } from "./base.model";

export class WipMasterModel extends BaseModelWithSharingData {

companyId: number ;
wipCd : string='' ;
wipSeq : number = 0;
itemizedGenCd : string ='';
bizUnitId: number = 0;
routeId : string ='';
wipFullNm : string ='';
wipDsplNm : string ='';
stockUnitGenCd : string ='';
asIsCd : string ='';
expiryDays : number = 0 ;
specText : string ='';
outsourcingYn : boolean = false;
semiProdYn : boolean = false;
mixYn : boolean = false;
changeOrderYn : boolean = false;
salesYn : boolean = false;
salesPrice : number ;
useYn : boolean = true;
creator : string = '';
createdTime : string ='';
changer : string ='';
changedTime : string = '';
remark : string = '';
delYn  : boolean = false;
// masMaterial: MateriaMasterlModel = new MateriaMasterlModel;
}
