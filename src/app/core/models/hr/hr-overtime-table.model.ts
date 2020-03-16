
import { BaseModel } from "@app/core/models/base.model";
import { DecimalPipe } from "@angular/common";

   export class HrOvertimeTableDetailModel extends BaseModel {     
     company_id : number = 0;
     ot_table_id : number = 0;
     trans_seq: number = 0;
     work_day_type_gen_cd : string = '';
     start_working_time : string = '';
     ref_working_time : string = '';
     ot_sum_hour : number = 0.00;
     ot_basic_hour : number = 0.00;
     ot_1_hour : number = 0.00;
     ot_2_hour : number = 0.00;
     ot_3_hour : number = 0.00;
     ot_4_hour : number = 0.00;
     ot_5_hour : number = 0.00;
     ot_6_hour : number = 0.00;
     ot_nor_pay1 : number = 0;
     ot_nor_pay2 : number = 0;
     ot_nor_pay3 : number = 0;
     ot_nor_pay4 : number = 0;
     ot_nor_pay5 : number = 0;
     ot_ovw_pay1 : number = 0;
     ot_ovw_pay2 : number = 0;
     ot_ovw_pay3 : number = 0;
     ot_ovw_pay4 : number = 0;
     ot_ovw_pay5 : number = 0;
     gen_nm: string = '';
     index : number = 0;
     
}

   export class HrMasOvertimeModels {     
     overtimes: HrOvertimeTableDetailModel[]=[];
     factorys: number[];
     company_id : number = 0;
     ot_table_id : number = 0;
}

export class HrMasOvertimeTableModel extends BaseModel { 
     company_id : number = 0;
     ot_table_id : number;
     ot_table_nm : string = '';
     start_working_time : string = '';
     end_working_time : string = '';
     end_ot_time : string ='';
     interval_minute : number = 0;
     buffer_minute : number = 0;
     begin_free_time : string = '';
     end_free_time : string ='';
     work_day_type_gen_cd : string = '';
}