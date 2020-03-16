import { BaseModel } from "@app/core/models/base.model";

export class SystemMenuModel extends BaseModel {

    menu_id: number = 0;
    menu_level: number = 1;
    menu_name: string = '';
    program_cd: string = '';
    navi_nm: string = 'n/a';
    parent_menu_id: string;
    orderby_seq: number = 1;
    mega_menu_nm: string = '';
    mega_menu_help_text: string = '';
    popup_yn: boolean;
    nodes: SystemMenuModel[];
    checked: boolean = false;
    indeterminate: boolean = false;

}