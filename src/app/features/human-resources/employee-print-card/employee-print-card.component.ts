import { Component, OnInit } from '@angular/core';
import { NotificationService, AuthService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { HrPrintingService } from '@app/core/services/hr.services/hr-printing.service';
import { BasePage } from '@app/core/common/base-page';
import { OrganizationModel } from '@app/core/models/organization.model';
import { HrPrintingCardModel } from '@app/core/models/hr/hr-printing.model';

@Component({
  selector: 'sa-employee-print-card',
  templateUrl: './employee-print-card.component.html',
  styleUrls: ['./employee-print-card.component.css']
})
export class EmployeePrintCardComponent extends BasePage implements OnInit {
  departments: OrganizationModel[] = [];
  orgid:any="";
  hrId:any='';
  hiredFrom:any='';
  hiredTo:any='';
  data:HrPrintingCardModel[]=[];
  constructor(
    private notification: NotificationService,
    public userService: AuthService,
    public organizationMasterService: OrganizationMasterService,
    public programService: ProgramService,
    private printService: HrPrintingService
  ) {super(userService); }

  ngOnInit() {
    this.organizationMasterService
    .listOrganization(this.companyInfo.company_id)
    .then(d => {
        this.departments = d;
    });
  }
  onCloseProgram(){
      this.programService.closeCurrentProgram();
  }
  onSearch(){
    if((this.orgid==null || this.orgid=="") && this.hrId==''&& this.hiredFrom==''){
      this.notification.showError('Please select at least one search condition!')
      return;
    }
    this.notification.showCenterLoading();
    this.printService.HrCardPrinting(this.orgid,this.hrId, this.hiredFrom, this.hiredTo).then(res=>{
      this.notification.hideCenterLoading();
      this.data=res;
    });
  }
  print() {
    var w = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    
    let htmlBody = $("#printTable").html();
    w.document.write('<html><head></head><body>' + htmlBody + '</body></html>');
    w.print();
    setTimeout(() => {
      w.close();
    }, 100);
  }
}
