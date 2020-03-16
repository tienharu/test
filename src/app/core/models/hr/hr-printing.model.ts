export class HrPrintingModel {
    print_id : number =  0;
    company_id :number = 0;
    report_id : number = 0;
    from_ymd: string='';
    to_ymd: string ='';
    remark: string;
    creator: string;
    changer: string;
    created_time: string='';
    changed_time: string = '';
   }

   export class HrPrintingCardModel {
    hr_id : string = '';
    employee_name : string;
    department :string = '';
    position : string = '';
    start_work_ymd : string = '';
    card_image:string='';
   }