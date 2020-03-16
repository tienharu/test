import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";
import { CRMSolutionApiService } from "@app/core/api/crm-solution-api.service";
import { NotificationService } from "@app/core/services/notification.service";
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { AuthService, UserMasterService, CanDeactivateGuard } from '@app/core/services';
import { TraderModel } from '@app/core/models/trader.model';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { BasePage } from '@app/core/common/base-page';
import { UserModel } from '@app/core/models/user.model';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'sa-customer-edit',
  templateUrl: './customer-edit.component.html'
})
export class CustomerEditComponent extends BasePage implements OnInit, CanDeactivateGuard {
  traderType: GeneralMasterModel[] = [];
  traderCate: GeneralMasterModel[] = [];
  traderChannel: GeneralMasterModel[] = [];
  traderProper: GeneralMasterModel[] = [];
  countries: GeneralMasterModel[] = [];
  important: GeneralMasterModel[] = [];
  payTerms: GeneralMasterModel[] = [];
  companies: any = [];
  user: UserModel[] = [];
  trader: any;
  traderInfo: TraderModel;
  options: any;
  @Input() traderId: number;
  @Input() traderJson: string;
  @Output() childCall = new EventEmitter();
  modalRef: BsModalRef;
  
  

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private traderService: TraderService,
    public userService: AuthService,
    public userMasterService: UserMasterService,
    private modalService: BsModalService,
    private router: Router,
    private generalMasterService: GeneralMasterService) {
    super(userService);
    
  }

  ngOnInit() {
    //console.log("traderJson",this.traderJson)
    this.checkPermission(ProgramList.Customer_Magt.valueOf());
    this.traderInfo = JSON.parse(this.traderJson);
    
    this.traderInfo.company_id = this.companyInfo.company_id;
 
    this.companies.push(this.companyInfo)

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
      proper_gen_cd: {
        required: true
      },
      trader_local_nm: {
        required: true
      },
      trader_sim_nm: {
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
      proper_gen_cd: {
        required: "Please select proper"
      },
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
  private GetUser() {
    return this.userMasterService.listUsers();
  }

  onSubmit() {
    console.log(this.traderInfo);
    this.traderService.InsertTrader(this.traderInfo).then(data => {
      if (data.error) {
        if (data.error.code === 403) {
          this.modalService.hide(1);
          this.router.navigate(["/error/error403"]);
        }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
        this.modalService.hide(1);
        this.childCall.emit();
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
  }

  
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.traderService.storeTemporaryModel(this.traderInfo);
    return true;
  }
  sharingToSelected(data){
    this.traderInfo.sharing_to=data;
    console.log('sharingToSelected',this.traderInfo.sharing_to)
}
onClose(){
  this.modalService.hide(1);
}
onDelete(){
  this.notification.confirmDialog(
    "Deleting this item ?",
    `Deleting an item will move it to the <span class='warning-emphasize'>trash</span>.<br />
    Deleted items <span class='warning-emphasize'>can</span> be <span class='warning-emphasize'>recovered from the Recycle Bin within 30 days</span>.<br />
    Do you want to continue?`,
    x => {
      if (x) {
        this.traderService.DeleteTrader(this.traderInfo).then(data => {
          if (data.error) {
            if (data.error.code === 403) {
              this.modalService.hide(1);
              this.router.navigate(["/error/error403"]);
            }
            this.notification.showMessage("error", data.error.message);
          } else {
            this.notification.showMessage("success", data.message);
            this.modalService.hide(1);
            this.router.navigate(['/customer-master']);
          }
        })
      }
    }
  );
}
}
