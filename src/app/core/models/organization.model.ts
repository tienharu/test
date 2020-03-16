import { GeneralMasterModel } from "@app/core/models/general_master.model";
import { BaseModel } from "./base.model";

export class OrganizationModel extends BaseModel {
    company_id: number=0;
    org_cd:number=0;
    has_child:number=0;
    org_tree_nm: string;
    org_nm_local: string;
    org_nm_eng: string;
    parent_org_id: number=0;
    level: number;
    org_from_ymd : string;
    org_to_ymd : string;
    factory_yn : boolean;
    is_system:boolean=false;
}

export class FactoryModel extends BaseModel {
    company_id: number=0;
    factory_id:number=0;
    factory_tree_nm: string;
    factory_nm_local: string;
    factory_nm_eng: string;
    parent_fac_id: string='0';
    selected: boolean = false;
}

export class OrganizationViewModel {
    company_id: number=0;
    org_cd:number=0;
    has_child:number=0;
    org_tree_nm: string;
    org_nm_local: string;
    org_nm_eng: string;
    parent_org_id: number=0;
    level: number;
    factory_yn : boolean;
    disabled : boolean=false;
    shiftwork_created:boolean=false
}