import { Component, OnInit } from '@angular/core';
import { ProgramService, NotificationService, CRMSolutionApiService, AuthService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { BaseModel } from '@app/core/models/base.model';
import { BasePage } from '@app/core/common/base-page';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { NgForm } from '@angular/forms';
import { SystemMenuModel } from '@app/core/models/system-menu.model';
import { BankBookMasterModel } from '@app/core/models/bank-book-master.model';
import { BankBookMasterService } from '@app/core/services/features.services/bank-book-master.service';
import { GlobalAcService } from '@app/core/services/global-ac.service';

@Component({
  selector: 'sa-bank-book',
  templateUrl: './bank-book.component.html',
  styleUrls: ['../../../../assets/css/smart-table.scss', './bank-book.component.css'],
})

export class BankBookMasterComponent extends BasePage implements OnInit {
  options: any;
  dateTimeNow: string;
  userName: any;
  detailInfo: BankBookMasterModel;
  bankLists : GeneralMasterModel[] = [];
  bankBookTypeLists : GeneralMasterModel[] = [];
  currencys: GeneralMasterModel[] = [];
  accounts : any[] = [];
  interestCalcs : GeneralMasterModel[] = [];
  // objTest = {
  //   useYn: true,
  //   createdTime: "",
  //   bankbookcd: "",
  //   bankbookno: "0349764740",
  //   bankbookacctcd: "10005000",
  //   bankcd: "120",
  //   branchnm: "Branch 3",
  //   bizplacecd: "1000",
  //   currencygin: "101100001000",
  //   bankbooknm: "Bankbook 3",
  //   bankbooktypegin: "408000000001",
  //   overdraftamount: 30,
  //   fromymd: "2020-02-12",
  //   toymd: "2020-02-13",
  //   interestrate: null,
  //   interestcalcgin: null,
  //   firstpayinymd: "2020-02-19",
  //   interval: "",
  //   monthlyamount: 0,
  //   suminterval: "",
  //   sumpayinamount: 0,
  //   maturityamount: 0,
  //   cancelymd: "2020-02-05",
  //   cancelreason: "2222",
  //   useyn: true,
  //   creator: "",
  //   createdtime: "",
  //   changer: "",
  //   changedtime: "",
  //   remark: "",
  //   delyn: false,
  //   companyid: 1000,
  // };
  constructor(public programService: ProgramService,
    public userService: AuthService,
    private notification: NotificationService,
    private i18nService: I18nService,
    private api: CRMSolutionApiService,
    private generalMasterService: GeneralMasterService,
    private globalAcService: GlobalAcService,
    private bankBookMasterService: BankBookMasterService) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.BankBook_Master.valueOf())
    this.detailInfo = new BankBookMasterModel();
    this.detailInfo.companyid = this.companyInfo.company_id;
    this.userName = this.userService.getUserInfo();
    this.dateTimeNow = new Date().toString('yyyy-MM-dd');
    this.initDatatable();
    return Promise.all([
      this.getBankList(),
      this.getBankBookTypeList(),
      this.getCurrency(),
      this.getAccount(),
      this.getInterestCal(),
    ]).then(res => {
      this.bankLists.push(...res[0]);
      this.bankBookTypeLists.push(...res[1]);
      this.currencys.push(...res[2]);
      this.accounts.push(...res[3]);
      this.interestCalcs.push(...res[4]);
      this.loadDataTable();
    });
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      transgroupgid: {
        required: true
      },
      transkoreanm: {
        required: true
      }
    },
    // Messages for form validation
    messages: {
      transgroupgid: {
        required: "Please select trans group"
      },
      transkoreanm: {
        required: "Please input value name"
      }
    }
  };
  private getBankList() {
    return this.bankBookMasterService.listGeneralType(Category.Bank.valueOf());
  }

  private getBankBookTypeList() {
    return this.bankBookMasterService.listGeneralType(Category.BankBookType.valueOf());
  }
  private getCurrency() {
    return this.generalMasterService.listGeneralByCate(Category.CurrencyCateCode.valueOf());
  }
  private getInterestCal() {
    return this.generalMasterService.listGeneralByCate(Category.InterestCalc.valueOf());
  }
  private getAccount() {
    return this.globalAcService.listGlobalAc();
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        callback({
          aaData: []
        });
      },
      columns: [
        { data: "bankbookno", width: "10%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var o = this.currencys.filter(x => x.gen_cd === data.currencygin);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "center", width: "5%"
        },
        // { data: "bizplacecd", width: "15%", className: "center" },
        {
          data: (data, type, dataToSet) => {
            var o = this.bankBookTypeLists.filter(x => x.gen_cd === data.bankbooktypegin);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "center", width: "20%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.bankLists.filter(x => x.gen_cd === data.bankcd);
            if (o.length > 0) return o[0].gen_nm;
            else return "N/A";
          }, className: "center", width: "20%"
        },
        { data: "bankbooknm", width: "20%", className: "center" },
        { data: "cancelreason", width: "10%" },
        {
          data: (data, type, dataToSet) => {
            return data.useyn ? "Yes" : "No";
          },
          className: "center",
          width: "5%"
        },
        { data: "remark", width: "10%" },
      ],
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.loadDataTable();
            this.detailInfo = new BankBookMasterModel();
          }
        },
        {
          extend: "selected",
          text: '<i class="fa fa-times text-danger" title="Delete"></i>',
          action: (e, dt, button, config) => {
            if (!this.permission.canDelete) {
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected = dt.row({ selected: true }).data();
            if (rowSelected) {
              var selectedText: string = "BankBook Master";
              this.notification.confirmDialog(                          
                "Delete BankBook Master  Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.bankBookMasterService.deleteBankBookMaster(rowSelected.bankbookcd).then(data => {
                      if (!data.success) {
                        this.notification.showMessage("error", data.message);
                      } else {
                        this.notification.showMessage(
                          "success",
                          "Deleted successfully"
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
        "csv",
        "pdf",
        "print"
      ]
    };
  }
  
  onSubmit() {
    this.detailInfo.companyid = this.companyInfo.company_id;
    this.detailInfo.bizplacecd = "1000";
    if (this.detailInfo.bankbookcd == "") {
      this.bankBookMasterService.insertBankBookMaster(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.bankBookMasterService.updateBankBookMaster(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.message);
        } else {
          this.notification.showMessage("success", data.message);
          this.reloadDatatable();
        }
      });
    }
  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    setTimeout(() => {
      this.detailInfo = event;
    }, 100);
  }
  onReset() {
    $("form.frm-detail").validate().resetForm();
    this.detailInfo = new BankBookMasterModel();
    this.reloadDatatable();
  }
  private reloadDatatable() {
    $(".dataTable").DataTable().ajax.reload();
    this.loadDataTable();
  }
  private loadDataTable() {
    return this.bankBookMasterService.listBankBookMasterAll().then(rs => {
      rs.sort(function (a, b) {
        return parseInt(b.bankbookcd)  - parseInt(a.bankbookcd);
      });
      var table = $('.tableBankBook').DataTable();
      table.clear();
      table.rows.add(rs).draw();
    });
  }
  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}


