import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AuthService, UserMasterService, NotificationService } from '@app/core/services';
import { GeneralMasterService } from '@app/core/services/features.services/general-master.service';
import { BasePage } from '@app/core/common/base-page';
import { TraderService } from '@app/core/services/features.services/trader-master.service';
import { ContactorService } from '@app/core/services/features.services/contactor-master.service';
import { Router } from '@angular/router';
import { CrmProjectService } from '@app/core/services/crm/project.service';
import { CrmProjectModel } from '@app/core/models/crm/project.model';
import { CrmSalesOpportunityService } from '@app/core/services/crm/sale-opportunity.service';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { Category } from '@app/core/common/static.enum';


@Component({
  selector: 'sa-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.css']
})
export class ProjectMasterComponent extends BasePage implements OnInit {
  @ViewChild("popupProject") popupProject;
  projectInfor: CrmProjectModel[] = [];
  modalRef: BsModalRef;
  userLogin: any;
  opportunities : CrmSalesOpportunityModel[] = [];
  projectType: any[] =[];
  // customer: any[] = [];
  // contactor: any[] = [];

  // user: any[] = []
  // saleType: any[] = [];
  // acitivityStatus: any[] = [];
  options: any;
  constructor(
    public userService: AuthService,
    public userMasterService: UserMasterService,
    private modalService: BsModalService,
    private generalMasterService: GeneralMasterService,
    private notification: NotificationService,
    private traderService: TraderService,
    private contactorService: ContactorService,
    private crmProjectService: CrmProjectService,
    private crmSalesOpportunityService : CrmSalesOpportunityService,
    public router: Router,
  ) {
    super(userService);
  }

  ngOnInit() {
    var _id = 0;
    this.userLogin = this.userService.getUserInfo();
    this.getOpportunityShortList().then(data =>{
      this.opportunities = data;
      console.log(this.opportunities)
    })
    this.getProjectType().then(data =>{
      this.projectType.push(...data)
    });
    this.initDatatable();
    // Promise.all([this.getCustomer(), this.getContactor(), this.getSytemUser()]).then(res => {
    //   setTimeout(() => {
    //     this.reloadDatatable();
    //   }, 100);
    // });
}

  public search() {
    let name = $('#txtKeyword').val().toLowerCase();
    // let cateId = $('#cbxTraderCate').val();
    // let inchargeId = $('#cbxIncharge').val();
    var tbl = $('.ProjectTbl').DataTable(); 
    tbl.search(name).draw() ;
  }
  openPopup() {
    let config = {
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.popupProject, config);
  }
  closePopup() {
    this.modalRef && this.modalRef.hide();
  }
  getOpportunityShortList(){
    return this.crmSalesOpportunityService.ShortList(this.userLogin.company_id);
  }
  getProjectType(){
    return this.generalMasterService.listGeneralByCate(Category.ProjectType.valueOf())
  }
  initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.crmProjectService.ListProject(this.userLogin.company_id).then(data => {
          data.forEach(data => {
            this.opportunities.forEach(opp => {
              if (data.salesopt_id == opp.salesopt_id) {
                data.salesopt_nm = opp.salesopt_nm
              }
            });
            this.projectType.forEach(opp => {
              if (data.project_type_gen_cd == opp.gen_cd) {
                data.project_type_nm = opp.gen_nm
              }
            });
          });
          setTimeout(() => {
            callback({
              aaData: data
            });
          }, 300);
        })
      },
      columns: [
        { data: (data) =>{
          return `<a href="/#/project-detail/${data.project_id}">${data.project_nm}</a>`
        }, className: "", width: "150px" },
        { data: "project_type_nm", className: "", width: "20px" },
        { data: "salesopt_nm", className: "", width: "150px" },
        { data: "start_ymd", className: "", width: "50px" },
        { data: "end_ymd", className: "", width: "50px" },
        { data: "work_hours", className: "", width: "20px" },
        { data: "work_hours", className: "", width: "20px" },
        { data: "changed_time", className: "", width: "50px" },
        // { 
        //   data: (data) => {
        //     var c = this.user.filter(
        //       x => x.user_id === data.admin_id
        //     );
        //     if (c.length > 0) return c[0].user_nm;
        //     else return "N/A";
        //   }, className: "", width: "100px"
        //  }
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
    $(".ProjectTbl")
      .DataTable()
      .ajax.reload();
  }
  checkKeycode(event){
    if (event.keyCode === 13) {
      this.search();
    }
  }
}
