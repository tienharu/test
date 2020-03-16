import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NotificationService, AuthService } from '@app/core/services';
import { BsModalService } from 'ngx-bootstrap';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { BasePage } from '@app/core/common/base-page';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';

@Component({
  selector: 'sa-find-opportunity-popup',
  templateUrl: './find-opportunity-popup.component.html',
  styleUrls: ['../project-master/project-master.component.css']
})
export class FindOpportunityPopupComponent extends BasePage implements OnInit {
  @Output() childCall = new EventEmitter();
  userLogin : any;
  opportunities : CrmSalesOpportunityModel[] = [];
  keyWord : any;
  customer: any[] = [];
  contactor: any[] = [];
  constructor(
    private notification: NotificationService,
    public userService: AuthService,
    private modalService: BsModalService,
    private crmSalesOpportunityService : CrmSalesOpportunityService,
    private traderService: TraderService,
    private contactorService: ContactorService,
  ) {
    super(userService);
  }

  ngOnInit() {
    this.userLogin = this.userService.getUserInfo();
    this.getCustomer();
  }
  getCustomer() {
    this.traderService.ShortList(this.userLogin.company_id).then(data => {
      this.customer.push(...data)
    })
  }
  // getContactor() {
  //   this.contactorService.ShortList(this.userLogin.company_id).then(data => {
  //     this.contactor.push(...data)
  //     console.log("contact",this.contactor)
  //   })
  // }
  search(){
    if (!this.keyWord) {
      this.notification.showMessage("error", "Please enter a business name");
      return;
    }
    this.crmSalesOpportunityService.ShortList(this.userLogin.company_id,this.keyWord).then(data =>{
      data.forEach(opp => {
        this.customer.forEach(cus => {
          if (opp.customer_id == cus.trader_id) {
            opp.customer_nm = cus.trader_local_nm;
          }
          if (opp.contractor_id == cus.trader_id) {
            opp.contractor_nm = cus.trader_local_nm;
          }
        });
      });
      setTimeout(() => {
        this.opportunities = data;
      }, 100);
    })
  }
  selectOpportunity(item){
    this.childCall.emit(item);
  }

  checkKeycode(event){
    if (event.keyCode === 13) {
      this.search();
    }
  }
  closePopup(){
    this.childCall.emit();
  }
}
