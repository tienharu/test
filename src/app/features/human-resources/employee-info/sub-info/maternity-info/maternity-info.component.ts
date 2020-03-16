import { Component, OnInit } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { HrMaternityInfoModel } from '@app/core/models/hr/hr-maternity-info.model';
import { NotificationService, AuthService } from '@app/core/services';
import { HrMainInfoService } from '@app/core/services/hr.services/hr-main-info.service';
import { HrMaternityInfoService } from '@app/core/services/hr.services/hr-maternity-info.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { HrMainInfoModel } from '@app/core/models/hr/hr-main-info.model';

@Component({
  selector: 'sa-maternity-info',
  templateUrl: './maternity-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class MaternityInfoComponent extends BasePage implements OnInit {
  maternityInfo: HrMaternityInfoModel;
 
  mainData : HrMainInfoModel;
  
  createdTime: string = '';
  constructor(
    private notification: NotificationService,
    private hrMaternityInfoService: HrMaternityInfoService,
    private generalMasterService: GeneralMasterService,
    public userService: AuthService,
    private i18nService: I18nService,
    private router: Router,
    private modalService: BsModalService,
  ) {
    super(userService);
    
  }

  ngOnInit() {
    this.maternityInfo = new HrMaternityInfoModel();
   
  }

  getDataFromMain(companyID: number, hrID: string) {
    this.maternityInfo = new HrMaternityInfoModel();
    
    this.maternityInfo.company_id = companyID;
    this.maternityInfo.hr_id = hrID;
    //console.log('getDataFromMain',this.maternityInfo)
    this.getMaternityDetail(companyID,hrID)
  }

  getMaternityDetail(companyId,hrId) {
    this.hrMaternityInfoService.getMaternityDetail(companyId,hrId).then(data => {
      console.log('getMaternityDetail',data)
      if(data.error){
        
      }
      else{
        this.maternityInfo = data;
      }
    })
  }
  resetData(){

  }

  onSubmit() {
    this.hrMaternityInfoService.insertHrMaternityInfo(this.maternityInfo).then(data => {
      if (data.error) {
        // if (data.error.code === 403) {
        //   this.modalService.hide(1);
        //   this.router.navigate(["/error/error403"]);
        // }
        this.notification.showMessage("error", data.error.message);
      } else {
        this.notification.showMessage("success", data.message);
      }
    })
  }

  changBirthDay()
  {
    let birthDay = new Date(this.maternityInfo.child_birthday);
    this.maternityInfo.child_7th_month = birthDay.addMonths(6).toString("yyyy-MM-dd");
  }
}
