export class PayrollClosingModel  {
    payment_salary_id: number = 0;
    salary_kind: string = "";
    company_id: number = 0;
    period: string = "";
    period_from : string = "";
    period_to : string = "";
    salary_period: Date;
    salary_period_from : Date;
    salary_period_to : Date;
    description : string ='';
  }