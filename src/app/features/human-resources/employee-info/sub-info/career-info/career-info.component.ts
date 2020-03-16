import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

import { LastCareComponent } from './last-care/last-care.component';
import { PathCareComponent } from './path-care/path-care.component';
import { CertificateComponent } from './certificate/certificate.component';


@Component({
  selector: 'sa-career-info',
  templateUrl: './career-info.component.html',
  styleUrls: ['../../main-info/main-info2.component.css']
})
export class HRCareerInfoComponent implements OnInit {
  @ViewChild(LastCareComponent) lastcarecpm: LastCareComponent;
  @ViewChild(PathCareComponent) pathcarecpm: PathCareComponent;
  @ViewChild(CertificateComponent) certificpm: CertificateComponent;
  companyId: number = 0;
  hrId: string = '';
  bkSubdata :string = 'last';
  bkhrID:string = '';
  constructor() { }
  
  ngOnInit() {}

  //
  getDataFromMain(companyID: number, hrID: string) {
    this.companyId = companyID;
    this.hrId = hrID;
    //bkhrID và bkSubdata có nhiệm vụ lưu trữ giá trị cuối cùng
    //kiểm tra nếu là lần đầu thì load last-tab
    if (this.bkhrID === '' ) {
      this.callChildCare('last');
      this.bkhrID = hrID;
    }else{//ngược lại thì gọi tab cuối cùng được gữ giá trị
      this.callChildCare(this.bkSubdata);
    }
  }

  callChildCare(subdata: string) {
    if (this.hrId) {
      this.bkSubdata = subdata;
      switch (subdata) {
        case 'last':
          this.lastcarecpm.getDataFromCareer(this.companyId,this.hrId);
          break;
        case 'path':
          this.pathcarecpm.getDataFromCareer(this.companyId,this.hrId);
          break;
        case 'certifi':
          this.certificpm.getDataFromCareer(this.companyId,this.hrId);
          break;
        default:
          break;
      }
    }
  }
  resetData(){
    this.callResetChild(this.bkSubdata)
  }

  callResetChild(child: string) {
    if (this.hrId) {
      switch (child) {
        case 'last':
          this.lastcarecpm.resetChildCare();
          break;
        case 'path':
          this.pathcarecpm.resetChildCare();
          break;
        case 'certifi':
          this.certificpm.resetChildCare();
          break;
        default:
          break;
      }
    }
  }
}
