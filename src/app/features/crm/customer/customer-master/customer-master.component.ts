import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService, AuthService, UserMasterService, CanDeactivateGuard } from '@app/core/services';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { UserModel } from '@app/core/models/user.model';
import { TraderModel } from '@app/core/models/trader.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { PagerService } from '@app/core/services/pager.service';

@Component({
  selector: 'sa-customer-master',
  templateUrl: './customer-master.component.html',
  styleUrls: ['./customer-master.component.css']
})
export class CustomerMasterComponent extends BasePage implements OnInit {
  items: any = [];
  traderCate: GeneralMasterModel[] = [];
  user: UserModel[] = [];
  traders: TraderModel[] = [];
  filterTraders: TraderModel[] = [];
  modalRef: BsModalRef;
  company: any = [];
  traderInfo: TraderModel;
  userInfo: UserModel;
  pager: any = {};
  pageSize = 6;
  isLoadPageClicked:boolean = false;
  @ViewChild("popupTraderEditData") popupTraderEditData;
  constructor(
    private notification: NotificationService,
    private traderService: TraderService,
    private pagerService : PagerService,
    public userService: AuthService,
    public userMasterService: UserMasterService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
    private router: Router
    ) {
    super(userService);
    
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Customer_Magt.valueOf());
    this.traderInfo = new TraderModel();
    this.userInfo = this.userService.getUserInfo();
    console.log("user",this.userInfo)
    this.traderInfo.company_id = this.companyInfo.company_id;
    this.getCate().then(data => {
      this.traderCate.push(...data);
      console.log("this.traderCate",this.traderCate)
    });
    this.GetUser().then(data => {
      this.user.push(...data);
    });
  
    Promise.all([this.getCate, this.GetUser]).then(res => {
      this.GetListBySearch();
    });
  }
  // private GetListTraders(keyword:any='',cateGenCd:any='',inchargeId:any='', favYn:any='') {

  //   this.traderService.ListTraderPaging(this.companyInfo.company_id,cateGenCd,inchargeId,keyword,true,null,favYn,1,this.pageSize).then(data => {
  //      if(data.total>this.pageSize){
  //       this.pager = this.pagerService.getPager(data.total, 1 ,this.pageSize);
  //      }
  //     else{
  //       this.pager={}
  //     }
  //   })
  // }


//   loadPage(page: number) {
//     this.pager.currentPage=page;
//     let name = $('#txtKeyword').val();
//     let traderCate = $('#cbxContactorCate').val();
//     let incharId = $('#cbxIncharge ').val();
//     this.traderService.ListTraderPaging(this.companyInfo.company_id,traderCate,incharId,name,true,null,this.favourite?this.favourite:'',page,this.pageSize).then(data => {


//     })
// }
loadPage(page: number) {
  this.pager.currentPage=page;
  let name = $('#txtKeyword').val();
  this.isLoadPageClicked = true;
  if (name != "") {
    var t = this.traderCate.filter(x => x.gen_nm.toLowerCase().includes(name));
      var u = this.user.filter(x => x.user_nm.toLowerCase().includes(name));
      if (t.length > 0) {
        this.GetListBySearch('',t[0].gen_cd,0,false,false,'',page,this.pageSize)
      }else if (u.length > 0) {
        this.GetListBySearch('','',u[0].user_id,false,false,'',page,this.pageSize)
      }
      else{
        this.GetListBySearch(name)
      }
  }else{
    this.GetListBySearch('','',0,false,false,'',page,this.pageSize);
  }
}

private getCate() {
  return this.generalMasterService.listGeneralByCate(Category.TransTypeCateCode.valueOf())
}
private GetUser() {
  return this.userMasterService.listUsers();
}

getInchargeName(inchargeId) {
  var u=this.user.filter(x=>x.user_id==inchargeId);
  if(u.length>0){
    return u[0].user_nm;
  }
  return 'N/A';
}
getTraderCate(id) {
  var f = this.traderCate.filter(x => x.gen_cd == id);
  if (f.length > 0) {
    return f[0].gen_nm;
  }
  return 'N/A';
}

  openPopup(trader) {
    if (trader != null) {
      this.traderInfo = trader;
    }
    else{
      this.traderInfo =new TraderModel();
    }
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupTraderEditData, config);
  }
  private reloadListTrader() {
    $(".traderListInfo")
    this.GetListBySearch();
  }
  closeTraderPopup() {
    this.modalRef && this.modalRef.hide();
    this.reloadListTrader();
  }

  

  favourite = false;
  searchFavourite() {
    this.favourite=!this.favourite;
    this.isLoadPageClicked =false;
    $('#txtKeyword').val('');
    this.GetListBySearch();
    if (this.favourite) {
      $('.fav-style').removeClass('fa-star-o').addClass('fa-star text-warning')
    } else {
      $('.fav-style').removeClass('fa-star text-warning').addClass('fa-star-o')
    }
  }
  private GetListBySearch(keyword:any='', cateGenCd:any='',inchargeId:number=0,crmYn:boolean=false,crmPartnerYn:boolean=false, favouriteYn:any='',page:number=1, pageSize:any='') {
    this.traderService.GetListBySearch(this.companyInfo.company_id,cateGenCd,inchargeId,keyword,crmYn,crmPartnerYn,this.favourite?this.favourite:'',page,this.pageSize).then(data => {
       this.traders = data.data;
       console.log("data",data)
       if (!this.isLoadPageClicked) {
        if(data.total>this.pageSize){
          this.pager = this.pagerService.getPager(data.total, 1 ,this.pageSize);
         }
        else{
          this.pager={}
        }
       }
    })
  }
  search() {
    let name = $('#txtKeyword').val().toLowerCase();
    this.isLoadPageClicked = false;
    if (name == "") {
      this.GetListBySearch();
    } else {
      var t = this.traderCate.filter(x => x.gen_nm.toLowerCase().includes(name));
      var u = this.user.filter(x => x.user_nm.toLowerCase().includes(name));
      if (t.length > 0) {
        this.GetListBySearch('',t[0].gen_cd)
      }else if (u.length > 0) {
        this.GetListBySearch('','',u[0].user_id)
      }
      else{
        this.GetListBySearch(name)
      }
    }
  }
  checkKeycode(event) {
    if (event.keyCode === 13) {
      this.search();
    }
  }
}
