import { BaseModelWithSharingData } from "@app/core/models/base.model";

export class GlobalMasterModel extends BaseModelWithSharingData {
    company_id: number = 0;
    global_unit_id: number = 0;
    global_type: number = 1;
    global_unit_nm: string = '';
    global_level: number = 0;
    global_sector: number = 1;
    orderby_seq: number = 1;
    parent_id: number = 0;
    use_yn: boolean = true;
    remark: string = '';
}

