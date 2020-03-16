export class BaseModel {
    constructor(){
    }
    use_yn: boolean = true;
    remark: string;
    creator: string;
    changer: string;
    created_time: string='';
    changed_time: string;
}

export class BaseModelV2 {
    constructor(){
    }
    useyn: boolean = true;
    remark: string;
    creator: string;
    changer: string;
    createdtime: string='';
    changedtime: string;
}
export class BaseModelV3 {
    constructor(){
    }
    useYn: boolean = true;
    remark: string;
    creator: string;
    changer: string;
    createdTime: string='';
    changedTime: string;
}
export class BaseModelWithSharingData {
    constructor(){
    }
    use_yn: boolean = true;
    remark: string;
    creator: string;
    changer: string;
    created_time: string='';
    changed_time: string;
    sharing_to:SharingDataModel[]=[];
}

export class SharingDataModel {
    sharing_type:number;
    sharing_to_id:number;
}