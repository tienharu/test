import { BaseModel } from "@app/core/models/base.model";

export class SharingGroupModel extends BaseModel {
    company_id: number = 0;
    sharing_group_id: number=0;
    sharing_group_nm: string ="";
}
export class SharingGroupUserModel extends BaseModel {
    company_id: number = 0;
    sharing_group_id: number=0;
    menu_id: number=0;
    user_id: number=0;
}

export class SharingGroupUserAddUpdateModel extends BaseModel {
    company_id: number = 0;
    sharing_group_id: number=0;
    user_id:number[]=[];
}

// menu
export class SharingGroupMenuModel extends BaseModel {
    company_id: number = 0;
    sharing_group_id: number=0;
    menu_id: number=0;
}

export class SharingGroupMenuAddUpdateModel extends BaseModel {
 company_id : number = 0;
 sharing_group_id : number = 0;
 menu_id : number[]=[];
}