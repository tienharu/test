import { MainBaseModel } from "./main-base.model";
import { BaseModel } from "./base.model";

export class RoutingMasterModel extends MainBaseModel {

  routeId: string = '';
  companyId: number = 0;
  routeName: string = '';
  routeClassGenCd: string = '';
  stockUnitGenCd: string = '';
  locationGenCd: string = '';
  outprocessYn: boolean = false;
  useYn: boolean = true;
  remark: string = '';
  routeSeq: number = 0;
}

