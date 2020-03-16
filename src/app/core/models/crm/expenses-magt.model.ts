import { BaseModel } from "@app/core/models/base.model";
import { fileUploadDataModel } from "@app/core/models/file-upload-data.model";

export class ExpensesModel extends BaseModel {
        company_id: number = 0;
        expenses_id: number = 0;
        expenses_gen_cd: string = "";
        expenses_amt: number = 0;
        pay_type_gen_cd: string = "";
        credit_card_gen_cd: string = ""; 
        sales_opt_id:  string = '';
        project_id:  string = '';
        // sales_opt_id:  number = 0;
        // project_id:  number = 0;
        expenses_contactor: ContactorLessModel[] = []
        bill_attach_file: string = "";
        file_data:fileUploadDataModel = null
        del_yn: boolean = false;
}
export class ContactorLessModel {
        company_id: number = 0;
        expenses_id: number = 0;
        person_type: number = 0;
        with_ref_id: number = 0;
        with_type: number = 0;
}
export class ExpensesContactorModel extends BaseModel {
        company_id: number = 0;
        crm_item_id: number = 0;
        crm_item_nm: string = "";
        crm_service_cate_id: number = 0;
        vender_text: string = "";
        price: number = 0;
        currency_gen_cd: number = 285100001000;
        item_unit_gen_cd: string = "";
        keyword_text:string = "";
        use_yn: boolean = false;
        del_yn: boolean = false;
}

