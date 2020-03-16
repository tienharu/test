import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AuthService, UserMasterService, NotificationService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { BasePage } from '@app/core/common/base-page';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { Router } from '@angular/router';


@Component({
  selector: 'sa-opportunity-master',
  templateUrl: './opportunity-master.component.html',
  styleUrls: ['./opportunity-master.component.css']
})
export class OpportunityMasterComponent extends BasePage implements OnInit {
  @ViewChild("popupOpportunity") popupOpportunity;
  saleOptList: CrmSalesOpportunityModel[] = [];
  saleOptListBK: CrmSalesOpportunityModel[] = [];
  modalRef: BsModalRef;
  customer: any[] = [];
  contactor: any[] = [];
  userLogin: any;
  user: any[] = []
  saleType: any[] = [];
  acitivityStatus: any[] = [];
  options: any;
  constructor(
    public userService: AuthService,
    public userMasterService: UserMasterService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
    private notification: NotificationService,
    private traderService: TraderService,
    private contactorService: ContactorService,
    private crmSalesOpportunityService: CrmSalesOpportunityService,
    public router: Router,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Sales_Opportunity.valueOf());
    
    var _id = 0;
    this.userLogin = this.userService.getUserInfo();
    // this.getCustomer(), this.getContactor(), this.getSytemUser()
    this.getSaleType().then(data => {
      this.saleType.push(...data);
    });
    this.getActivitiStatus().then(data => {
      this.acitivityStatus.push(...data)
    })
    this.initDatatable();
    Promise.all([this.getCustomer(), this.getContactor(), this.getSytemUser()]).then(res => {
      setTimeout(() => {
        this.reloadDatatable();
      }, 100);
    });
}

  getCustomer() {
    this.traderService.ListTrader(this.userLogin.company_id).then(data => {
      this.customer.push(...data)
    })
  }
  getContactor() {
    this.contactorService.ListContactor(this.userLogin.company_id, '').then(data => {
      this.contactor.push(...data)
    })
  }
  getSytemUser() {
    this.userMasterService.listUsers().then(data => {
      this.user.push(...data)
    })
  }
  getSaleType() {
    return this.generalMasterService.listGeneralByCate(Category.SalesOptType.valueOf())
  }
  getActivitiStatus() {
    return this.generalMasterService.listGeneralByCate(Category.ActivityStatus.valueOf())
  }
 
  public search() {
    let name = $('#txtKeyword').val().toLowerCase();
    // let cateId = $('#cbxTraderCate').val();
    // let inchargeId = $('#cbxIncharge').val();
    var tbl = $('.opportunityTbl').DataTable(); 
    tbl.search(name).draw() ;
  }
  openPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupOpportunity, config);
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
  initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.crmSalesOpportunityService.ListSalesOpportunity(this.userLogin.company_id).then(data => {
          callback({
            aaData: data
          });
          data.forEach(element => {
            this.saleType.forEach(saletype => {
              if (element.salesopt_type_gen_cd == saletype.gen_cd) {
                element.salesopt_type_nm = saletype.gen_nm;
              }
            });
            this.customer.forEach(cs => {
              if (element.contractor_id == cs.trader_id) {
                element.contractor_nm = cs.trader_local_nm;
              }
              if (element.customer_id == cs.trader_id) {
                element.customer_nm = cs.trader_local_nm;
              }
            });
            this.contactor.forEach(ct => {
              if (element.contractor_contactor_id == ct.contactor_id) {
                element.contractor_contactor_nm = ct.contactor_nm;
              }
              if (element.customer_contactor_id == ct.contactor_id) {
                element.customer_contactor_nm = ct.contactor_nm;
              }
            });
            this.user.forEach(us => {
              if (element.admin_id == us.user_id) {
                element.admin_nm = us.user_nm;
              }
            });
            if (element.sale_activitys) {
              this.acitivityStatus.forEach((status, index, arr) => {
                if (element.sale_activitys.sales_status_gen_cd == status.gen_cd) {
                  element.sale_activitys.sales_status_gen_nm = status.gen_nm;
                  element.sale_activitys.sales_status_num = status.number_value_1;
                }
              });
            }
          });
           this.saleOptListBK = this.saleOptList= data;
        })
      },
      columns: [
        { data: (data) =>{
          return `<a href="/#/opportunity-detail/${data.salesopt_id}">${data.salesopt_nm}</a>`
        }, className: "", width: "715px" },
        {
          data: (data) => {
            var c = this.saleType.filter(
              x => x.gen_cd === data.salesopt_type_gen_cd
            );
            if (c.length > 0) return c[0].gen_nm;
            else return "N/A";
          }, className: "", width: "100px"
        },
        {
          data: (data) => {
            var c = this.customer.filter(
              x => x.trader_id === data.customer_id
            );
            var e = this.contactor.filter(
              x => x.contactor_id === data.customer_contactor_id
            );
            if (c.length > 0 && e.length > 0) {
              return `<div class="label-span"><span class="label label-info">${c[0].trader_local_nm}</span></div>
                      <div class="label-span"><span class="label label-warning">${e[0].contactor_nm}</span></div>`
            } else if (c.length > 0) return `<div class="label-span"><span class="label label-info">${c[0].trader_local_nm}</span></div>`;
            else if (e.length > 0) return `<div class="label-span"><span class="label label-warning">${e[0].contactor_nm}</span></div>`;
            else return "";
          }, className: "", width: "130px"
        },
        {
          data: (data) => {
            var c = this.customer.filter(
              x => x.trader_id === data.contractor_id
            );
            var e = this.contactor.filter(
              x => x.contactor_id === data.contractor_contactor_id
            );
            if (c.length > 0 && e.length > 0) {
              return `<div class="label-span"><span class="label label-info">${c[0].trader_local_nm}</span></div>
              <div class="label-span"><span class="label label-warning">${e[0].contactor_nm}</span></div>`;
            } else if (c.length > 0) return `<div class="label-span"><span class="label label-info">${c[0].trader_local_nm}</span></div>`;
            else if (e.length > 0) return `<div class="label-span"><span class="label label-warning">${e[0].contactor_nm}</span></div>`
            else return "";
          }, className: "", width: "130px"
        },
        {
          data: (data) => {
            if (data.sale_activitys) {
              var date = new Date(data.sale_activitys.created_time);
              var month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
              var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
              var datas = date.getFullYear() + "-" + month + '-' + day;
              return datas;
            } else return "";

          }, className: "center", width: "80px"
        },
        {
          data: (data) => {
            if (data.sale_activitys) {
              return `${data.sale_activitys.expect_amt.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} <i class="fa fa-won"></i>`
            } else return "";
          }, className: "center", width: "115px"
        },
        {
          data: (data) => {
            if (data.sale_activitys) {
              var c = this.acitivityStatus.filter(
                x => x.gen_cd === data.sale_activitys.sales_status_gen_cd
              );
              if (c.length > 0) {
                let num = c[0].number_value_1;
                var _class = "";
                switch (num) {
                  case 20:
                    _class = 'twenty'
                    break;
                  case 40:
                    _class = 'fourty'
                    break;
                  case 60:
                    _class = 'sixty'
                    break;
                  case 80:
                    _class = 'eighty'
                    break;
                  case 100:
                    _class = 'hundred'
                    break;
                  default:
                    break;
                }
                let data = `<div class="smart-tbl-progress">
                              <div class="customProgress" style="height:13px">
                                <span style="width:${num}%" class="${_class}"></span>
                              </div> <p>${num}%</p>
                            </div>`;
                if (num == 0) {
                  return ` <p class="lost-holding">Lost or Holding</p>`
                }else return data
              }
              else return "";
            } else return "";

          }, className: "", width: "150px"
        },
        {
          data: (data) => {
            if (data.sale_activitys) {
              let num = data.sale_activitys.possibility;
              var _class = "";
              switch (true) {
                case (num <= 20):
                  _class = 'twenty'
                  break;
                case (num <= 40):
                  _class = 'fourty'
                  break;
                case (num <= 60):
                  _class = 'sixty'
                  break;
                case (num <= 80):
                  _class = 'eighty'
                  break;
                  case (num <= 99):
                  _class = 'ninety'
                  break;
                case (num == 100):
                  _class = 'hundred'
                  break;
                default:
                  break;
              }
              return `<div class="smart-tbl-progress">
                        <div class="customProgress" style="height:13px">
                          <span style="width:${num}%" class="${_class}"></span>
                        </div> <p>${num}%</p>
                      </div>`
            }
            else return "";
          }, className: "", width: "150px"
        },
        {
          data: (data) => {
            if (data.sale_activitys) {
              var date = new Date(data.sale_activitys.changed_time);
              var month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
              var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
              var datas = date.getFullYear() + "-" + month + '-' + day;
              return datas;
            } else return "";

          }, className: "center", width: "80px"
        },
        { 
          data: (data) => {
            var c = this.user.filter(
              x => x.user_id === data.admin_id
            );
            if (c.length > 0) return c[0].user_nm;
            else return "N/A";
          }, className: "", width: "100px"
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
        "copy",
        "excel",
        "pdf",
        "print"
      ]
    };
  }
  private reloadDatatable() {
    $(".opportunityTbl")
      .DataTable()
      .ajax.reload();
  }
  checkKeycode(event){
    if (event.keyCode === 13) {
      this.search();
    }
  }
}
