import { Component, OnInit, ViewChild, Input, AfterViewChecked, AfterViewInit } from '@angular/core';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService, AuthService, UserMasterService, CanDeactivateGuard, ProgramService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { UserModel } from '@app/core/models/user.model';
import { CrmMasServiceCategoryService, CrmMasServiceItemService } from '@app/core/services/crm/setting-item.service';
import { CrmMasServiceCategoryModel, CrmMasServiceItemModel } from '@app/core/models/crm/setting-item.model';
import { Category } from '@app/core/common/static.enum';
import { ExpensesService } from '@app/core/services/crm/expenses-magt.service';
import { ExpensesModel } from '@app/core/models/crm/expenses-magt.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonFunction } from '@app/core/common/common-function';
import * as _ from 'lodash';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { CrmProjectService } from '@app/core/services/crm/project.service';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';



@Component({
  selector: 'sa-customer-master',
  templateUrl: './expenses-magt.component.html',
  styleUrls: ['./expenses-magt.component.css']
})
export class ExpensesMagtComponent extends BasePage implements OnInit {


  @ViewChild("popupExpenses") popupExpenses;

  modalRef: BsModalRef;

  userInfo: UserModel;
  expensesType: GeneralMasterModel[] = []
  paymentType: GeneralMasterModel[] = []
  creditCard: GeneralMasterModel[] = []

  salesOpportunity: any[] = [];
  projectOpportunity: any[] = [];
  customer: any[] = [];
  contactor: any[] = [];
  user: any[] = [];

  level: any = []

  listCrmMasServiceCategoyModel: CrmMasServiceCategoryModel[] = []
  listParentCategory: CrmMasServiceCategoryModel[] = []
  listParentCategoryShow: CrmMasServiceCategoryModel[] = []
  listInput: any = {}
  expensesModel: ExpensesModel
 
  
  isDisabledCredit: boolean;

  //Data table option
  optionsCategory: {}

  constructor(
    private notificationService: NotificationService,

    public userService: AuthService,
    public userMasterService: UserMasterService,
    private generalMasterService: GeneralMasterService,
    public programService: ProgramService,
    private modalService: BsModalService,

    private crmSalesOpportunityService: CrmSalesOpportunityService,
    private CrmProjectService: CrmProjectService,

    private traderService: TraderService,
    private contactorService: ContactorService,

    public expensesService: ExpensesService,
  ) {
    super(userService);
  }

  ngOnInit() {
    //general info
    this.loadGeneralInfo()
    // console.log("user", this.userInfo)
    this.initExpensesTable()


  }
  loadGeneralInfo() {
    this.userInfo = this.userService.getUserInfo();
    // console.log("this.userInfo", this.userInfo)

    this.expensesModel = this.expensesService.initModel(this.userInfo.company_id)
    // this.crmMasServiceItemModel = this.crmMasServiceItemService.initModel(this.userInfo.company_id)

    this.loadExpensesType().then(data => {
      this.expensesType.push(...data)
      // console.log("expensesType", this.expensesType)
    })
    this.loadPaymentType().then(data => {
      this.paymentType.push(...data)
      // console.log("paymentType", this.paymentType)
    })
    this.loadCreditCard().then(data => {
      this.creditCard.push(...data)
      // console.log("creditCard", this.creditCard)
    })

    this.getCustomer();
    this.getContactor();
    this.getSytemUser();
    this.getListSaleOpportunity()
    this.getListProjectOp()

    this.initValidation()
  }

  getListSaleOpportunity() {
    this.crmSalesOpportunityService.ListSalesOpportunity(this.userInfo.company_id).then(data => {
      this.salesOpportunity.push(...data);
      // console.log('List salesOpportunity', this.salesOpportunity)
    })
  }
  getListProjectOp() {
    this.CrmProjectService.ListProject(this.userInfo.company_id).then(data => {
      this.projectOpportunity.push(...data);
      // console.log('List projectOpportunity', this.projectOpportunity)
    })
  }
  getCustomer() {
    this.traderService.ListTrader(this.userInfo.company_id).then(data => {
      this.customer.push(...data)
      console.log('List customer', this.customer)
    })
  }
  getContactor() {
    this.contactorService.ListContactor(this.userInfo.company_id, '').then(data => {
      this.contactor.push(...data)
      console.log('List contactor', this.contactor)
    })
  }
  getSytemUser() {
    this.userMasterService.listUsers().then(data => {
      this.user.push(...data)
      console.log('List user', this.user)
    })
  }

  loadExpensesType() {
    return this.generalMasterService.listGeneralByCate(Category.ExpensesType)
  }
  loadPaymentType() {
    return this.generalMasterService.listGeneralByCate(Category.PaymentType)
  }
  loadCreditCard() {
    return this.generalMasterService.listGeneralByCate(Category.CreditCardType)
  }

  //table 1
  initExpensesTable() {
    this.optionsCategory = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.expensesService.getList(this.loggedUser.company_id).then(data => {
          console.log('data', data)
          callback({
            aaData: data
          })
        })
      },
      columns: [
        {
          data: (row) => {
            // console.log('row',row)
            var f = this.expensesType.filter(x => x.gen_cd == row.expenses_gen_cd);
            if (f.length > 0)
              // return `<a  class='abcasd' >${f[0].gen_nm}</a>`
              return f[0].gen_nm
            else
              return "N/A";
          },
          width:'200px',
        },
        {
          data: "account_ymd",
          width:'80px',
          class:'center'
        },
        {
          data: "expenses_amt",
          width:'100px',
          class:'right',
          render: $.fn.dataTable.render.number(',')
        },
        {
          data: (row) => {
            var f = this.paymentType.filter(x => x.gen_cd == row.pay_type_gen_cd);
            if (f.length > 0)
              return f[0].gen_nm;
            else
              return "N/A";
          },
          width:'200px',
        },
        {
          data: (row) => {
            var f = this.creditCard.filter(x => x.gen_cd == row.credit_card_gen_cd);
            if (f.length > 0)
              return f[0].gen_nm;
            else
              return "N/A";
          },
          width:'200px',

        },
        {
          data: "remark", 
        },
      ],

      pageLength: 25,
      scrollY: 500,
      scrollX: true,
      paging: true,
      // info: false,
      ordering: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
          }
        },
        // {
        //   extend: "selected",
        //   text: '<i class="fa fa-times text-danger" title="Delete"></i>',
        //   action: (e, dt, button, config) => {
        //     var rowSelected = dt.row({ selected: true }).data();
        //     rowSelected.json_language = "";
        //     // console.log('rowSelected',rowSelected)
        //     if (rowSelected) {
        //       var selectedText: string = ''
        //       this.notificationService.confirmDialog(
        //         "Delete Language Confirmation!",
        //         `Are you sure to delete ${selectedText}?`,
        //         x => {
        //           if (x) {
        //             CommonFunction.ReloadDataTable('tableExpenses')
        //             // this.expensesService.delete(this.expensesModel).then(data => {
        //             //   // console.log('Data Delete',data)
        //             //   if (data.status != 1) {
        //             //     this.notificationService.showMessage("error", data.data.message);
        //             //   } else {
        //             //     this.notificationService.showMessage(
        //             //       "success",
        //             //       "Deleted successfully"
        //             //     );
        //             //     CommonFunction.ReloadDataTable('tableExpenses')
        //             //   }
        //             // });
        //           }
        //         }
        //       );
        //     }
        //   }
        // },

        {
          extend: "print",
          text: "Print"
        }
      ]

    }
  }

  //#region crud Data

  //#endregion

  onNewExpenses() {
    this.loadAllDataToComboBox()
    this.expensesModel = this.expensesService.initModel(this.companyInfo.company_id)
    this.listInput.model = this.expensesModel
    let curentDate = new Date()
    this.listInput.model.created_time = CommonFunction.formatDate(curentDate)
    this.isDisabledCredit = true
    this.openPopup()
  }
  onRowClickExpenses(value) {
    // console.log('value', value)
    this.expensesModel = value
    //clone modal để replace value của 2 combobox Link Sales Opportunity or Project & Customer or Contactor or User và gán lại dữ liệu mỗi khi click mở poppup
    let cloneModel = _.clone(this.expensesModel)
    // console.log('clone', _.clone(this.expensesModel))

    if (cloneModel.sales_opt_id != null) {
      let val = cloneModel.sales_opt_id
      cloneModel.sales_opt_id = '1-' + val
    }
    if (cloneModel.project_id != null) {
      let val = cloneModel.project_id
      cloneModel.project_id = '2-' + val
    }
    this.loadAllDataToComboBox()
    this.listInput.model = cloneModel
    this.isDisabledCredit = false
    this.openPopup()

  }

  initValidation() {
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  openPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupExpenses, config);
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
  
  loadAllDataToComboBox() {
    this.listInput.expensesType = this.expensesType
    this.listInput.paymentType = this.paymentType
    this.listInput.creditCard = this.creditCard
    this.listInput.infoUser = this.userInfo
    //Load trước data của 2 combobox  Link Sales Opportunity or Project & Customer or Contactor or User  để improve performance khi mở popup
    this.listInput.salesOpportunity = this.salesOpportunity
    this.listInput.projectOpportunity = this.projectOpportunity
    this.listInput.customer = this.customer
    this.listInput.contactor = this.contactor
    this.listInput.user = this.user
  }

}
