import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { AuthService, UserMasterService, CanDeactivateGuard, ProgramService } from '@app/core/services';
import { TraderModel } from '@app/core/models/trader.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { publish } from 'rxjs/operators';
import { UserModel } from '@app/core/models/user.model';
import { Observable } from 'rxjs';
import { I18nService } from '@app/shared/i18n/i18n.service';

@Component({
  selector: 'sa-trader-master',
  templateUrl: './trader-master.component.html',
  styleUrls: ['./trader-master.component.css']
})
export class TraderMasterComponent extends BasePage implements OnInit, CanDeactivateGuard {
  traderType: GeneralMasterModel[] = [];
  traderCate: GeneralMasterModel[] = [];
  traderChannel: GeneralMasterModel[] = [];
  traderProper: GeneralMasterModel[] = [];
  countries: GeneralMasterModel[] = [];
  important: GeneralMasterModel[] = [];
  payTerms: GeneralMasterModel[] = [];
  companies:any=[];
  user: UserModel[] = [];
  //traderType: any[] = [];
  traderInfo: TraderModel;
  options: any;


  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private traderService: TraderService,
    public userService: AuthService,
    public programService: ProgramService,
    private i18nService: I18nService,

    public userMasterService: UserMasterService,
    private generalMasterService: GeneralMasterService) {
    super(userService);
    
  }
    
  ngOnInit() {
    this.checkPermission(ProgramList.Register_Trader.valueOf())
    this.companies.push(this.companyInfo)
    this.traderInfo = this.traderService.getModel();
    this.traderInfo.company_id = this.companyInfo.company_id;
    this.initDatatable();
    this.getType().then(data => {
      this.traderType.push(...data);
    });
    this.getCate().then(data => {
      this.traderCate.push(...data);
    });
    this.getchannel().then(data => {
      this.traderChannel.push(...data);
    });
    this.getProper().then(data => {
      this.traderProper.push(...data);
    });
    this.getCountries().then(data => {
      this.countries.push(...data);
    });
    this.getImportant().then(data => {
      this.important.push(...data);
    });
    this.getPayTerms().then(data => {
      this.payTerms.push(...data);
    });
    this.GetUser().then(data => {
      this.user.push(...data);
    });
    
  }
  
  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      type_gen_cd: {
        required: true
      },
      cate_gen_cd: {
        required: true
      },
      channel_gen_cd: {
        required: true
      },
      // proper_gen_cd: {
      //   required: true
      // },
      trader_local_nm: {
        required: true
      },
      trader_sim_nm :{
        required: true
      },
      important_gen_cd: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      type_gen_cd: {
        required: "Please select type"
      },
      cate_gen_cd: {
        required: "Please select category"
      },
      channel_gen_cd: {
        required: "Please select channel"
      },
      // proper_gen_cd: {
      //   required: "Please select proper"
      // },
      trader_local_nm: {
        required: "Please enter"
      },
      trader_sim_nm: {
        required: "Please enter"
      },
      important_gen_cd: {
        required: "Please select important"
      }
    }
  };

  private getType() {
    return this.generalMasterService.listGeneralByCate(Category.TradeTypeCateCode.valueOf())
  }
  private getCate() {
    return this.generalMasterService.listGeneralByCate(Category.TransTypeCateCode.valueOf())
  }
  private getchannel() {
    return this.generalMasterService.listGeneralByCate(Category.ChannelCateCode.valueOf())
  } 
  private getProper() {
    return this.generalMasterService.listGeneralByCate(Category.PropertyCateCode.valueOf())
  }
  private getImportant() {
    return this.generalMasterService.listGeneralByCate(Category.Important.valueOf())
  }
  private getCountries() {
    return this.generalMasterService.listGeneralByCate(Category.CountryCateCode.valueOf())
  }
  private getPayTerms() {
    return this.generalMasterService.listGeneralByCate(Category.PaymentTermsCateCode.valueOf())
  }
  private GetUser(){
    return this.userMasterService.listUsers();
  }
  
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.traderService.ListTrader(this.companyInfo.company_id).then(data => {
          callback({
            aaData: data
          });
        })
      },
      columns: [

        { data: "trader_id", className: "center", width: "50px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.traderType.filter(x => x.gen_cd === data.type_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "80px"
        },
        //{ data: "type_gen_cd", className: "right", width: "80px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.traderCate.filter(x => x.gen_cd === data.cate_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "80px"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.traderChannel.filter(x => x.gen_cd === data.channel_gen_cd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "", width: "80px"
        },
        // {
        //   data: (data, type, dataToSet) => {
        //     var o = this.traderProper.filter(x => x.gen_cd === data.proper_gen_cd);
        //     if (o.length > 0) return o[0].gen_nm;
        //     else return "N/A";
        //   }, className: "", width: "80px"
        // },
        { data: "trader_local_nm", className: "", width: "80px" },
        //{ data: "incharge_id", className: "center", width: "80px" },
        {
          data: (data, type, dataToSet) => {
            var o = this.user.filter(x => x.user_id === data.incharge_id);
            if (o.length > 0) return o[0].user_nm;
            else return "N/A";
          }, className: "", width: "80px"
        },
        { data: "ceo_nm", className: "", width: "80px" },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center",
          width: "50px"
        },
        
        { data: "creator", className: "", width: "80px" },
        { data: "created_time", className: "center", width: "80px" },
      ],
      scrollY: 210,
      scrollX: true,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.traderInfo = new TraderModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = rowSelected.trader_local_nm;
              this.notification.confirmDialog(
                "Delete Trader Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.traderService.DeleteTrader(this.traderInfo).then(data => {
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
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  onRowClick(event) {
    setTimeout(() => {
      this.traderInfo = event;
    }, 100);
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
  }

  onSubmit() {
    console.log(this.traderInfo);
    this.traderService.InsertTrader(this.traderInfo).then(data => {
      if (data.error) {
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.reloadDatatable();
      }
    });
  }
  
  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
    this.traderService.resetModel();
    this.traderInfo = this.traderService.getModel();
    this.traderInfo.company_id = this.companyInfo.company_id;
    this.reloadDatatable();
  }

  private reloadDatatable() {
    $(".traderListInfo")
      .DataTable()
      .ajax.reload();
  }
  
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.traderService.storeTemporaryModel(this.traderInfo);
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}
