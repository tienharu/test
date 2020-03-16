import { Component, OnInit } from '@angular/core';
import { NotificationService, AuthService, OrganizationMasterService, ProgramService } from '@app/core/services';
import { HrMachineDataService } from '@app/core/services/hr.services/hr-mas-machine-data.service';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { I18nService } from '@app/shared/i18n/i18n.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { BasePage } from '@app/core/common/base-page';
import { UserModel } from '@app/core/models/user.model';
import { ProgramList } from '@app/core/common/static.enum';
import { OrganizationModel } from '@app/core/models/organization.model';
import { from } from 'rxjs';
import { HrMasMachineDataModel, SearchMachineDataModel } from '@app/core/models/hr/hr-mas-machine-data.model';

@Component({
  selector: 'sa-attendance-machine',
  templateUrl: './attendance-machine.component.html',
  styleUrls: ['./attendance-machine.component.css']
})
export class MasMachineComponent extends BasePage implements OnInit {

  searchInfo: SearchMachineDataModel;
  masMachineList: any[] = [];
  userInfo: UserModel;
  options: any;
  departments: OrganizationModel[] = [];
  click:boolean=false;

  constructor(private notification: NotificationService,
    private hrMasMachineService: HrMachineDataService,
    private generalMasterService: GeneralMasterService,
    private i18nService: I18nService,
    public userService: AuthService,
    public programService: ProgramService,
    public organizationMasterService: OrganizationMasterService,
    private router: Router,
    private modalService: BsModalService, ) {
    super(userService);
  }

  ngOnInit() {
    //this.checkPermission(ProgramList.ETL_from_Machine.valueOf());
    this.searchInfo = new HrMasMachineDataModel();
    this.userInfo = this.userService.getUserInfo();
    this.searchInfo.company_id = this.userInfo.company_id;
    this.searchInfo.fromDate = Date.today().addDays(-3).toString('yyyy-MM-dd');
    this.searchInfo.toDate = Date.today().toString('yyyy-MM-dd');
    this.initDatatable()
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        if(this.click){
          this.hrMasMachineService.listAttendanceMachineData(this.searchInfo.company_id, this.searchInfo.hr_id, this.searchInfo.fromDate, this.searchInfo.toDate).then(data => {
            //console.log("data", data)
            callback({
              aaData: data
            });
          })
        }
        else{
          callback({
            aaData: []
          });
        }
      },
      columns: [
        { data: "hr_id", className: "center", width: "100px" },
        { data: "employee_nm", className: "left", width: "250px" },
        // { data: "department", width: "100px", className: "center" },
        { data: "check_date", className: "center", width: "150px" },
        { data: "creator", className: "center", width: "120px" },
        { data: "created_time", className: "center", width: "120px" },
        { data: "source_cd", className: "left", width: "120px" },
        { data: "remark", className: "" },
      ],
      scrollY: 570,
      scrollX: false,
      paging: true,
      pageLength: 25,
      buttons: [
        
      ]
    };
  }

  searchData() {
    if (this.searchInfo.fromDate != null) {
      this.click=true;
      this.reloadDatatable()
    }
    else {
      this.click=false;
      this.notification.showInfo('From date is required', { titmeOut: 1000 });
    }
  }

  excelExport() {
     
    this.notification.showCenterLoading(); 
        this.hrMasMachineService.downloadAttendanceMachineData(this.searchInfo.company_id, this.searchInfo.hr_id, this.searchInfo.fromDate, this.searchInfo.toDate).then(data => {
          
          this.notification.hideCenterLoading();
        })
  }

  private reloadDatatable() {
    $(".MachineListInfo")
      .DataTable()
      .ajax.reload();
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }
}
