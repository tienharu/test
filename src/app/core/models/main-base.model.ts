export class MainBaseModel {
    constructor(){
    }
    useYn: boolean = true;
    remark: string;
    creator: string;
    changer: string;
    createdTime: string='';
    changedTime: string;
}
export class MainBaseModelWithSharingData {
    constructor(){
    }
    useYn: boolean = true;
    remark: string;
    creator: string;
    changer: string;
    createdTime: string='';
    changedTime: string;
    sharingTo:SharingDataModel[]=[];
}

export class SharingDataModel {
    sharingType:number;
    sharingToId:number;
}