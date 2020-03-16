import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { NotificationService, AuthService, UserMasterService, CanDeactivateGuard } from '@app/core/services';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { UserModel } from '@app/core/models/user.model';
import { ContactorModel } from '@app/core/models/contactor.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { TraderModel } from '@app/core/models/trader.model';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { PagerService } from '@app/core/services/pager.service';

@Component({
  selector: 'sa-contactor-master',
  templateUrl: './contactor-master.component.html',
  styleUrls: ['./contactor-master.component.css']
})
export class ContactorMasterComponent extends BasePage implements OnInit {
  contactorInfo: ContactorModel;
  userInfo: UserModel;
  user: UserModel[] = [];
  company: any = [];
  contactor: ContactorModel[] = [];
  ContactorType: GeneralMasterModel[] = [];
  modalRef: BsModalRef;
  traderLocalName: TraderModel[] = [];
  Level: GeneralMasterModel[] = [];
  Rule: GeneralMasterModel[] = [];
  pager: any = {};
  pageSize=6;
  isLoadPageClicked:boolean = false;

  @ViewChild("popupContactorEditData") popupContactorEditData;
  constructor(
    private notification: NotificationService,
    private contactorService: ContactorService,
    private pagerService : PagerService,
    public userService: AuthService,
    public userMasterService: UserMasterService,
    private modalService: BsModalService,
    private traderService: TraderService,
    private generalMasterService: GeneralMasterService) {
    super(userService);
  }

  ngOnInit() {
    this.checkPermission(ProgramList.Contactor_Magt.valueOf());
    this.contactorInfo = new ContactorModel();
    this.userInfo = this.userService.getUserInfo();
    this.contactorInfo.company_id = this.companyInfo.company_id;

    this.GetUser().then(data => {
      this.user.push(...data);
    });

    this.getLevelType().then(data => {
      this.Level.push(...data);
    });

    this.getRuleType().then(data => {
      this.Rule.push(...data);
    });

    this.GetTrader().then(data => {
      this.traderLocalName.push(...data);
    });

    Promise.all([this.GetTrader, this.GetUser]).then(res => {
      this.GetListBySearch();
    });

    this.getContactorType().then(data => {
      this.ContactorType.push(...data);
    });
    
  }

  

  private getContactorType() {
    return this.generalMasterService.listGeneralByCate(Category.ContactorType.valueOf())
  }

  private getLevelType() {
    return this.generalMasterService.listGeneralByCate(Category.ContactorLevel.valueOf())
  }

  private getRuleType() {
    return this.generalMasterService.listGeneralByCate(Category.ContactorRule.valueOf())
  }

  private GetUser() {
    return this.userMasterService.listUsers();
  }

  private GetTrader() {
    return this.traderService.ListTrader(this.companyInfo.company_id);
  }

  getContactorName(Id) {
    var contactor = this.ContactorType.filter(x => x.gen_cd == Id);
    if (contactor.length > 0) {
      return contactor[0].gen_nm;
    }
    return 'N/A';
  }

  getContactor(id) {
    var f = this.ContactorType.filter(x => x.gen_cd == id);
    if (f.length > 0) {
      return f[0].gen_nm;
    }
    return 'N/A';
  }

  getAmName(amId) {
    var u = this.user.filter(x => x.user_id == amId);
    if (u.length > 0) {
      return u[0].user_nm;
    }
    return 'N/A';
  }
  getRuleName(rule) {
    var u = this.Rule.filter(x => x.gen_cd == rule);
    if (u.length > 0) {
      return u[0].gen_nm;
    }
    return 'N/A';
  }
  getLevelName(level) {
    var u = this.Level.filter(x => x.gen_cd == level);
    if (u.length > 0) {
      return u[0].gen_nm;
    }
    return 'N/A';
  }
  loadPage(page: number) {
    this.pager.currentPage=page;
    let name = $('#txtKeyword').val();
    this.isLoadPageClicked = true;
    if (name != "") {
      var t = this.traderLocalName.filter(x => x.trader_local_nm.toLowerCase().includes(name));
      var c = this.ContactorType.filter(x => x.gen_nm.toLowerCase().includes(name));
      var u = this.user.filter(x => x.user_nm.toLowerCase().includes(name));
      var l = this.Level.filter(x => x.gen_nm.toLowerCase().includes(name));
      var r = this.Rule.filter(x => x.gen_nm.toLowerCase().includes(name));
      if (t.length > 0) {
        this.GetListBySearch('',t[0].trader_id,'',0,'','','',page,this.pageSize)
      }else if (c.length > 0) {
        this.GetListBySearch('',0,c[0].gen_cd,0,'','','',page,this.pageSize)
      }else if (u.length > 0) {
        this.GetListBySearch('',0,'',u[0].user_id,'','','',page,this.pageSize)
      }else if (l.length > 0) {
        this.GetListBySearch('',0,'',0,l[0].gen_cd,'','',page,this.pageSize)
      }else if (r.length > 0) {
        this.GetListBySearch('',0,'',0,'',r[0].gen_cd,'',page,this.pageSize)
      }
      else{
        this.GetListBySearch(name)
      }
    }else{
      this.GetListBySearch('',0,'',0,'','','',page,this.pageSize);
    }
}
  

  private reloadListContactor() {
    $(".contactorListInfo")
    this.GetListBySearch();
  }

  openPopup(contactor) {
    if (contactor != null) {
      this.contactorInfo = contactor;
    }
    else {
      this.contactorInfo = new ContactorModel();
    } 
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupContactorEditData, config);
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

  closeContactorPopup() {
    this.modalRef && this.modalRef.hide();
    this.reloadListContactor();
  }
  private GetListBySearch(keyword:any='', traderId:Number=0,contactorType:any='',adminId:number=0,level:any='',rule:any='', favYn:any='',page:number=1, pageSize:any='') {
    this.contactorService.GetListBySearch(this.companyInfo.company_id,keyword,traderId,contactorType,adminId,level,rule,this.favourite?this.favourite:'',page,this.pageSize).then(data => {
       this.contactor = data.data;
       console.log(data)
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
      var t = this.traderLocalName.filter(x => x.trader_local_nm.toLowerCase().includes(name));
      var c = this.ContactorType.filter(x => x.gen_nm.toLowerCase().includes(name));
      var u = this.user.filter(x => x.user_nm.toLowerCase().includes(name));
      var l = this.Level.filter(x => x.gen_nm.toLowerCase().includes(name));
      var r = this.Rule.filter(x => x.gen_nm.toLowerCase().includes(name));
      if (t.length > 0) {
        this.GetListBySearch('',t[0].trader_id)
      }else if (c.length > 0) {
        this.GetListBySearch('',0,c[0].gen_cd)
      }else if (u.length > 0) {
        this.GetListBySearch('',0,'',u[0].user_id)
      }else if (l.length > 0) {
        this.GetListBySearch('',0,'',0,l[0].gen_cd)
      }else if (r.length > 0) {
        this.GetListBySearch('',0,'',0,'',r[0].gen_cd)
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

