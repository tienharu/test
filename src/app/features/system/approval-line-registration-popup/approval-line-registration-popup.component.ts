import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CrmSalesOpportunityModel } from '@app/core/models/crm/sales-opportunity.model';
import { BasePage } from '@app/core/common/base-page';
import { AuthService, NotificationService, ProgramService, OrganizationMasterService } from '@app/core/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import _ from "lodash";
import { BomMasterPopupService } from '@app/core/services/features.services/bom-master-popup-service';
import { BomItem } from '@app/core/models/bom-assy-master.model';
import { ApprovalLineRegistrationService } from '@app/core/services/features.services/approval-line-reg.service';
import { ApprovalLineRegistrationSysUsers } from '@app/core/models/approval-line-registration-detail.model';
import { OrganizationModel } from '@app/core/models/organization.model';
import { Category } from '@app/core/common/static.enum';

@Component({
  selector: 'sa-approval-line-registration-popup',
  templateUrl: './approval-line-registration-popup.component.html',
  styleUrls: ['./approval-line-registration-popup.component.css']
})
export class ApprovalLinePopupComponent extends BasePage implements OnInit, AfterViewInit {
  opportunityInfo: CrmSalesOpportunityModel;
  adminInChage: any[] = [];

  modalRef: BsModalRef;
  isDisable: boolean = false;
  bomItems: BomItem[] = [];
  bomItemsSeachResult: BomItem[] = [];
  searhInfo: BomItem;

  listSysUser : ApprovalLineRegistrationSysUsers[] = [];
  listProcessApprovor : GeneralMasterModel[];
  listTypeApprovor : GeneralMasterModel[];
  positions: GeneralMasterModel[] = [];
  organizations: OrganizationModel[] = [];
  options: any;
  // @ViewChild("popupBomItem") popupBomItem;
  userLogin: any;
  @Output() childCall = new EventEmitter();
  constructor(
    private notification: NotificationService,
    public programService: ProgramService,
    public approvalLineRegistrationService: ApprovalLineRegistrationService,
    private orgService: OrganizationMasterService,
    public userService: AuthService,
    private bomMasterPopupService: BomMasterPopupService,
    private modalService: BsModalService
  ) {
    super(userService);
  }

  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
    },
    // Messages for form validation
    messages: {
    }
  };


  ngOnInit() {
    this.initDatatable();
    return Promise.all([
      this.getSysUsers(),
      this.getPositions(),
      this.getOrganizations(),
    ]).then(res => {
        this.listSysUser.push(...res[0]);
        this.positions.push(...res[1]);
        this.organizations.push(...res[2]);
        this.loadDataTable();
    });
  }

  ngAfterViewInit(): void {
     this.loadDataTable();
  }
  private loadDataTable() {
      var table = $('.tableItem').DataTable();
      table.clear();
      table.rows.add(this.listSysUser).draw();
    
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        callback({
          aaData: []
        });
      },
      columns: [
        {
          data: (data, type, dataToSet) => {
            return data.user_nm;
          },
          className: "center", width: "30%"
        },
        {
          data: (data, type, dataToSet) => {
            var o = this.organizations.filter(
              x => x.org_cd === data.org_id
            );
            if (o.length > 0) return o[0].org_nm_eng;
            else return "N/A";
          },
          className: "center", width: "20%"
        },
        {
          data: (data, type, dataToSet) => {
            var p = this.positions.filter(
              x => x.gen_cd === data.position_gen_cd
            );
            if (p.length > 0) return p[0].gen_nm;
            else return "N/A";
          },
          className: "center", width: "50%"
        },
      ],
      pageLength: 15,
      bSort: false,
      scrollX: true,
      // scrollY: 350,
      // paging: false,
    };
  }

  onRowClick(event) {
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    this.childCall.emit(event);
    this.modalService.hide(1);
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onClose() {
    this.modalService.hide(1);
  }
  getSysUsers(){
    return this.approvalLineRegistrationService.listSysUsers(this.loggedUser.company_id);
  }
  getPositions() {
    return this.approvalLineRegistrationService.getPositions(this.loggedUser.company_id);
  }
  getOrganizations() {
    return this.approvalLineRegistrationService.listOrganization(this.loggedUser.company_id)
  }
  getProcess(){
    return this.approvalLineRegistrationService.listGeneralProcess(Category.ApProcess.valueOf());
  }
  getType(){
    return this.approvalLineRegistrationService.listGeneralType(Category.ApType.valueOf());
  }
}
