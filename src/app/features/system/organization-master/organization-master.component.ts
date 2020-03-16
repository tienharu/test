import { Component, OnInit } from '@angular/core';
import { CanDeactivateGuard } from '@app/core/guards/can-deactivate-guard';
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';
import { CRMSolutionApiService } from '@app/core/api/crm-solution-api.service';
import { NotificationService } from '@app/core/services/notification.service';
import { Category, ProgramList } from '@app/core/common/static.enum';
import { OrganizationModel } from '@app/core/models/organization.model';
import { CompanyModel } from '@app/core/models/company.model';

import { OrganizationMasterService } from '@app/core/services/features.services/organization-master.service';

import { BasePage } from '@app/core/common/base-page';
import { AuthService, ProgramService } from '@app/core/services';
import { I18nService } from '@app/shared/i18n/i18n.service';
@Component({
  selector: 'sa-organization-master',
  templateUrl: './organization-master.component.html',
  styleUrls: ['./organization-master.component.css']
})
export class OrganizationMasterComponent extends BasePage implements OnInit, CanDeactivateGuard {
  companies: CompanyModel[] = [];
  parents: OrganizationModel[] = [];
  parentsFiltered: OrganizationModel[] = [];
  detailInfo: OrganizationModel;
  options: any;
  companyIdBackup:number = 0;
  isRowClick : boolean = false;
  isDisabled: boolean = false;

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    private organizationMasterService: OrganizationMasterService,
    public programService: ProgramService,
    private i18nService: I18nService,
    public userService: AuthService
    ) {
      super(userService);
  }


  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      org_nm_local: {
        required: true
      },
      org_nm_eng: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      org_nm_local: {
        required: "Please select the local name"
      },
      org_nm_eng: {
        required: "Please enter the eng name"
      },
    }
  };

  ngOnInit() {
    this.checkPermission(ProgramList.Register_Organization.valueOf())
    this.getCompanies().then(data => {
      this.companies.push(...data);     
    });
    this.initModel();
    this.initDatatable();
  }
  initModel(){
    if (this.companyIdBackup === 0) {
      this.detailInfo = this.organizationMasterService.getModel();
      this.detailInfo.is_system=this.userService.isSystemCompany();
    this.companyIdBackup = this.detailInfo.company_id=this.loggedUser.company_id;
    }
    else{
      this.detailInfo = new OrganizationModel();
      this.detailInfo.is_system=this.userService.isSystemCompany();
      this.detailInfo.company_id=this.companyIdBackup;
    }
  }
  private getCompanies() {
    let _isSytem = this.userService.isSystemCompany()? 'list' : 'details';
    return new Promise<any>((resolve, reject) => {
      this.api.get(`company/${_isSytem}`).subscribe(data => {         
        resolve(data.data);
      });
    });
  }
  onChangeCompany(companyId:number){    
    if (this.companyIdBackup !== companyId && !this.isRowClick) {
      this.reloadDatatable();
      this.detailInfo.is_system = true;
      this.companyIdBackup = companyId;
      this.detailInfo.company_id = companyId;
    }
  }
  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.organizationMasterService.listOrganization(this.detailInfo.company_id).then(data => {         
          Promise.all([
            this.getCompanies
          ]).then(res => {
            this.parents=data;
            this.parentsFiltered = this.parents;
            //this.setParentOrg();
            callback({
              aaData: data
            });
          });
        });
      },
      columns: [
        { data: "org_cd",className: "center", width: "40px" },
        { data: "org_tree_nm" },
        { data: "org_nm_local" },
        // { data: "org_from_ymd", width: "80px" },
        // { data: "org_to_ymd", width: "80px" },
        {
          data: (data, type, dataToSet) => {
            return data.factory_yn ? "Yes" : "No";
          },
          className: "center", width: "40px"
        },
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center", width: "40px"
        },
        // { data: "remark", className: "center" },
        { data: "creator", className: "", width: "80px" },
        {
          data: "created_time",
          className: "center", width: "100px"
        },
        { data: "changer", className: "", width: "80px" },
        {
          data: "changed_time",
          className: "center", width: "100px"
        }
      ],
      scrollY: 500,
      paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.reloadDatatable();
            this.initModel();
          }
        }, 
        {
          extend: 'selected',
          text: '<i class="fa fa-trash-o" title="Delete"></i>',
          action: ( e, dt, button, config ) => {
            if(!this.permission.canDelete){
              this.notification.showMessage("error", this.i18nService.getTranslation('CM_MSG_DELETE_PERMISSION_DENIED'));
              return;
            }
            var rowSelected=dt.row( { selected: true } ).data()
            if(rowSelected){
              var selectedText: string = rowSelected.gen_nm;
              this.notification.confirmDialog(
                "Delete Organization Confirmation!",
                `Are you sure to delete ${selectedText}?`,
                x => {
                  if (x) {
                    this.organizationMasterService.deleteOrganization(rowSelected).then(data => {
                      if (!data.success) {
                            this.notification.showMessage("error", data.message);
                          }
                          else{
                            this.notification.showMessage("success", "Deleted successfully");
                            this.reloadDatatable();
                            this.initModel();
                          }
                    });
                  }
                }
              );
              
            }
          }
        },       
        "copy",        
        "csv",
        "excel",
        "pdf",
        "print"
      ]
    };
  }

  getTime(){
    var d=new Date();
    return d.getMinutes()+":"+ d.getSeconds()+":"+ d.getMilliseconds();
  }

  onRowClick(event) {
    this.isRowClick = true;
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
    
    this.detailInfo = event;
    //Filter parent
    this.parentsFiltered = this.parents.filter(x => x.org_cd != this.detailInfo.org_cd);
    //filter child
    this.parentsFiltered = this.parentsFiltered.filter(x => x.parent_org_id != this.detailInfo.org_cd);
    this.isDisabled = true;
  }

  onSubmit() {
    
    //this.detailInfo.parent_org_id = this.parent_org_id.toString();
    if (this.detailInfo.org_cd == undefined) {
      this.detailInfo.org_cd = 0;
    }
    //console.log(`Submitting ${JSON.stringify(this.detailInfo)}`);
    if (this.detailInfo.org_cd === 0) {
      this.organizationMasterService.insertOrganization(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
          this.initModel();
        }
      });
    } else {
      this.organizationMasterService.updateOrganization(this.detailInfo).then(data => {
        if (!data.success) {
          this.notification.showMessage("error", data.data.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
          this.initModel();
        }
      });
    }
    this.isRowClick = false;
    this.companyIdBackup = this.detailInfo.company_id;
  }

  onReset() {
    $("form.frm-detail")
      .validate()
      .resetForm();

    // this.organizationMasterService.resetModel();
    this.companyIdBackup = 0;
    this.initModel();
    this.reloadDatatable();
  }

  private reloadDatatable() {
    $(".dataTable")
      .DataTable()
      .ajax.reload();
      this.detailInfo = new OrganizationModel();
      this.detailInfo.company_id = this.companyIdBackup;
      this.isRowClick = false;
      this.isDisabled = false;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.organizationMasterService.storeTemporaryModel(this.detailInfo);
    return true;
  }
  onCloseProgram(){
    this.programService.closeCurrentProgram();
  }
}