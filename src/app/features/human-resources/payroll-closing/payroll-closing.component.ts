import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService, AuthService, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { PayrollClosingModel } from '@app/core/models/hr/hr-payroll-closing.model';
import { PayrollMasterService } from '@app/core/services/hr.services/hr-payroll-master.service';
import { I18nService } from '@app/shared/i18n/i18n.service';

@Component({
  selector: 'sa-payroll-closing',
  templateUrl: './payroll-closing.component.html',
  styleUrls: ['./payroll-closing.component.css']
})
export class PayrollClosingComponent extends BasePage implements OnInit {

  salaryKind: GeneralMasterModel[] = [];
  month: string;
  model : PayrollClosingModel = new PayrollClosingModel;
  monthsYear: any = [];
  year: any = [];
  options: any;
  validationOptions:any={};
  creating:boolean=false;
  resultMsg:any='';
  status:any=-1;
  constructor( 
    public i18n: I18nService,
    public userService: AuthService,
    private generalMasterService: GeneralMasterService,
    public programService: ProgramService,
    public payrollService: PayrollMasterService,
    private notification: NotificationService) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Closing_Payroll.valueOf());
    this.loadYearMonth();
    this.loadYear();
    this.getSalaryKind().then(data => {
      this.salaryKind.push(...data);
    });
    this.initDatatable();
  }

  private getSalaryKind() {
    return this.generalMasterService.listGeneralByCate(Category.SalaryKind.valueOf())
  }

  loadYearMonth() {
    var d1 = new Date().addMonths(-6);
    var d2 = new Date().addMonths(1);
    while (d2 > d1) {
      d2 = d2.addMonths(-1);
      this.monthsYear.push({ text: d2.toString('yyyy-MM'), val: d2.toString('yyyy-MM-dd') });
    }
  }

  loadYear() {
    var d1 = new Date().addYears(-3);
    var d2 = new Date().addYears(1);
    while (d2 > d1) {
      d2 = d2.addYears(-1);
      this.year.push({ text: d2.toString('yyyy'), val: d2.toString('yyyy') });
    }
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.payrollService.getPaymentSalary().then(data => {
           callback({
            aaData: data.data
          });
        });
      },
      columns: [
        { data: "payment_salary_id", className: "center", width: "40px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.salaryKind.filter(x => x.gen_cd === data.salary_kind);
            if (o.length > 0) 
              return o[0].gen_nm;
            else 
              return "";
          }, className: "", width: "130px"
        },
        { data: (data, type, dataToSet) => { 
            if(data.salary_kind == "670000000002" || data.salary_kind == "670000000003"){
              return new Date(data.salary_period).toString("yyyy");
            }
            return new Date(data.salary_period).toString("yyyy-MM");
         }, className: "center", width: "80px" },
        { data: (data, type, dataToSet) => { 
            if(data.salary_period_from == "0001-01-01T00:00:00")
            {
              return "";
            }
            else
            {
              return new Date(data.salary_period_from).toString("yyyy-MM-dd");
            }
          }, className: "center", width: "80px" 
        },
        { data: (data, type, dataToSet) => { 
            if(data.salary_period_to == "0001-01-01T00:00:00")
            {
              return "";
            }
            else
            {
              return new Date(data.salary_period_to).toString("yyyy-MM-dd");
            }
          }, className: "center", width: "80px" 
        },
        { data: "remark", className: "", width: "200px" },
        { data: "creator", className: "center",width: "80px"},
        { data: (data, type, dataToSet) => { 
          if(data.created_time == "0001-01-01T00:00:00")
          {
            return "";
          }
          else
          {
            return new Date(data.created_time).toString("yyyy-MM-dd HH:mm:ss");
          }
        }, 
        className: "center",width: "80px"},
        {
          data: (data, type, dataToSet) => {
              return "<a class='salary' href='javascript:void(0)'" +
              "data-payment_salary_id='" + data.payment_salary_id + "'" +
              "data-salary_kind='" + data.salary_kind + "'" +
              "data-salary_period='" + data.salary_period + 
              "'>" + this.i18n.getTranslation("CLOSING_PAYROLL_DOWNLOAD") + "</a>";
          }, className: "center", width: "80px"
        }
      ],
      scrollY: 210,
      scrollX: true,
      paging: true,
      pageLength: 25,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-trash-o" title="Delete"></i>',
          action: (e, dt, button, config) => {
              if(!this.permission.canDelete){
                  this.notification.showMessage("error", this.i18n.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
                  return;
                }
              var rowSelected = dt.row({ selected: true }).data();
              if (rowSelected) {
                  var selectedText: string = rowSelected.payroll_item_name;
                  this.notification.confirmDialog(
                      this.i18n.getTranslation('PAYROLL_ITEM_CONFIRM'),
                      this.i18n.getTranslation('PAYROLL_ITEM_CONFIRM_DELETE') ,
                      x => {
                          if (x) {
                              this.payrollService.deletePayroll(rowSelected).then(data => {
                                if (data.error) {
                                  this.notification.showMessage("error", data.error.message);
                                } else {
                                  this.notification.showMessage(
                                    "success",
                                    data.message
                                  );
                                  this.reloadDatatable();
                                }
                              })
                          }
                      }
                  );
              }
          }
      },
      ]
    };
    setTimeout(() => {
      $(".ListInfo").on("click", ".salary", e => {
        e.preventDefault();
        this.download($(e.target).data("payment_salary_id"),
        $(e.target).data("salary_kind"),
        $(e.target).data("salary_period"));
      });
    }, 500);
  }

  onRowClick(e){
    //console.log('onRowClick',e)
    //this.model = e;
    // var period = new Date(this.model.salary_period);
    // if(this.model.salary_kind == "670000000000")
    // {
    //   this.model.period = new Date(`${period.getFullYear()}-${period.getMonth()+1}-${new Date().getDate()}`).toString("yyyy-MM-dd");
    // }  
    // if(this.model.salary_kind == "670000000001")
    // {
    //   var from = new Date(this.model.salary_period_from);
    //   this.model.period_from = new Date(`${from.getFullYear()}-${from.getMonth()+1}-${from.getDate()}`).toString("yyyy-MM-dd");
    //   var to = new Date(this.model.salary_period_to);
    //   this.model.period_to = new Date(`${to.getFullYear()}-${to.getMonth()+1}-${to.getDate()}`).toString("yyyy-MM-dd");
    // }  
    // if(this.model.salary_kind == "670000000002" || this.model.salary_kind == "670000000003"){
    //   this.model.period = period.getFullYear().toString();
    // }
  }

  download(payment_salary_id,salary_kind,salary_period ){
    this.resultMsg='';
    var salary = "";
    this.model.salary_kind = salary_kind;
    this.model.salary_period = salary_period;
    this.model.payment_salary_id = payment_salary_id;
    this.salaryKind.filter(function(value, index, arr){
      if(value.gen_cd == salary_kind)
      {
        salary = value.gen_nm;
        return value.gen_nm;
      }
    });
    this.creating=true;
    this.notification.showCenterLoading();
    this.payrollService.DownLoad(this.model, salary).then(data => {
      this.creating=false;
      this.notification.hideCenterLoading();
      if(data.error){
        this.status=0;
        this.notification.showError(data.error.message);
        this.resultMsg=data.error.message;
        return;
      }
      this.status=1;
      this.resultMsg='Downloaded successfully';
    });
  }

  onSubmit(){
    this.resultMsg='';
    if(!this.validate())
    {
      return;
    }
    if(this.model.salary_kind == "670000000001")
    {
      this.model.salary_period = new Date(this.model.period_from);
      this.model.salary_period_from = new Date(this.model.period_from);
      this.model.salary_period_to = new Date(this.model.period_to);
    }  
    else
    {
      var period = new Date(this.model.period);
      this.model.salary_period = new Date(period.getFullYear(), period.getMonth(), 1, 12, 0, 0, 0);
      this.model.salary_period_from = null;
      this.model.salary_period_to = null;
    }
    this.creating=true;
    this.notification.showCenterLoading();
    this.payrollService.closePayroll(this.model).then(data => {
      this.creating=false;
      this.notification.hideCenterLoading();
      if(data.error){
        this.notification.showError(data.error.message);
        this.resultMsg=data.error.message;
        this.status=0;
        return;
      }
      this.notification.showSuccess('Payroll created successfully, you can download excel file');
      this.resultMsg='Payroll created successfully';
      this.status=1;
      this.reloadDatatable();
    });
  }

  validate()
  {
    if(this.model.salary_kind == "670000000001")
    {
      this.model.period = "";
      if(!this.model.salary_kind || !this.model.period_from || this.model.period_from == "" || !this.model.period_to || this.model.period_to == "")
      {
        this.notification.showMessage(
          "error",
          this.i18n.getTranslation("PAROLL_CLOSING_MSG_SALARY_KIND_DATE_REQUIRED")
        );
        return false;
      }
    }
    else
    {
      this.model.period_from = "";
      this.model.period_to = "";
      if(!this.model.salary_kind || !this.model.period || this.model.period=="")
      {
        this.notification.showMessage(
          "error",
          this.i18n.getTranslation("PAROLL_CLOSING_MSG_SALARY_KIND_DATE_REQUIRED")
        );
        return false;
      }
    }
    return true;
  }

  private reloadDatatable() {
    $(".ListInfo")
        .DataTable()
        .ajax.reload();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
