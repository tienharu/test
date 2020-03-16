import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BasePage } from '@app/core/common/base-page';
import { CategoryModel } from '@app/core/models/category.model';
import { NgForm } from "@angular/forms";
import { GeneralMasterModel } from '@app/core/models/general_master.model';
import { NameValueModel } from '@app/core/models/name-value.model';
import { CompanyModel } from '@app/core/models/company.model';
import { CRMSolutionApiService, NotificationService, ProgramService, AuthService } from '@app/core/services';
import { CompanyMasterService } from '@app/core/services/features.services/company-master.service';
import { ProgramList } from '@app/core/common/static.enum';
import { GlobalMasterService } from '@app/core/services/features.services/global-master.service';
import _ from 'lodash';
import { GlobalMasterModel } from '@app/core/models/global_master.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'sa-global-master',
  templateUrl: './global-master.component.html',
  styleUrls: ['./global-master.component.css']  
})
export class GlobalMasterComponent extends BasePage implements OnInit {
  cate_cd: number;
  Categories: CategoryModel[] = [];
  parents: GlobalMasterModel[] = [];
  detailInfo: GlobalMasterModel;
  options: any;
  optionSelect: any;
  companyIdSelected: number;
  isFilterGrid: boolean = true;
  global_type: number = 1;
  globalTypes: NameValueModel[] = [
    {
      name: "Top",
      value: 1
    },
    {
      name: "Company",
      value: 2
    },
    {
      name: "Unit",
      value: 3
    }
  ];
  global_sector: number = 1;
  globalSectors: NameValueModel[] = [
    {
      name: "Business",
      value: 1
    },
    {
      name: "Staff",
      value: 2
    }
  ];
  companies: CompanyModel[] = [];

  constructor(private api: CRMSolutionApiService,
    private notification: NotificationService,
    public programService: ProgramService,
    public userService: AuthService,
    private modalService: BsModalService,
    private router: Router,
    private globalMasterService: GlobalMasterService,
    private cdr: ChangeDetectorRef) {
    super(userService);
    // this.cate_cd = Category.OrgCateCode;
  }


  public validationOptions: any = {
    ignore: [], //enable hidden validate
    // Rules for form validation
    rules: {
      global_unit_nm: {
        required: true
      },
    },
    // Messages for form validation
    messages: {
      global_unit_nm: {
        required: "Please enter the global unit name"
      },
    }
  };

  ngOnInit() {
    // this.checkPermission(ProgramList.Mas_Global.valueOf())   
    this.detailInfo = this.globalMasterService.getModel();
    this.loadCompanies(this.detailInfo.global_type, this.detailInfo.global_sector);
    this.initDatatable();
  }

  ngAfterViewInit() {
    //this.loadCompanies(this.detailInfo.global_type, this.detailInfo.global_sector);
  }

  private getParents(value) {
    return new Promise<any>((resolve, reject) => {
      this.api.get(`sysgeneral/details/catecd/${value}`).subscribe(data => {
        resolve(data.data);
      });
    });
  }

  private initDatatable() {
    this.options = {
      dom: "Bfrtip",
      ajax: (data, callback, settings) => {
        this.globalMasterService.listGlobalMasterAll().then(data => {
          callback({
            aaData: data
          });
        });
      },
      columns: [
        { data: "global_unit_id", class: "center", width: "100px" },
        { data: "global_unit_nm", class: "center", width: "200px", className: "w200" },
        { data: "global_type", class: "center", width: "100px" },
        { data: "company_id", class: "center", width: "100px"},
        { data: "global_sector", class: "center", width: "100px"},
        {
          data: (data, type, dataToSet) => {
            return data.use_yn ? "Yes" : "No";
          },
          className: "center", width: "80px"
        },
        { data: "remark", class: "center", width: "300px"}
      ],
      pageLength: 10,
      scrollX: true,
      // scrollY: 350,
      // paging: false,
      buttons: [
        {
          text: '<i class="fa fa-refresh" title="Refresh"></i>',
          action: (e, dt, node, config) => {
            dt.ajax.reload();
            this.detailInfo = new GlobalMasterModel();
          }
        },
        "copy",
        "excel",
        "pdf",
        "print"
      ],
    };
  }

  onRowClick(event) {
    setTimeout(() => {
      this.detailInfo = event;
      this.getCompanies(this.detailInfo.global_type, this.detailInfo.global_sector).then(data => {     
        this.companies = [...data];
      });
    }, 100);
    var f = $("form.frm-detail").validate();
    if (!f.valid()) {
      f.resetForm();
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  onCloseProgram() {
    this.programService.closeCurrentProgram();
  }

  onSubmit() {
    this.companyIdSelected = this.detailInfo.company_id;
    if (this.detailInfo.global_unit_id == 0){
      this.globalMasterService.insertGlobal(this.detailInfo).then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    } else {
      this.globalMasterService.updateGlobal(this.detailInfo).then(data => {
        if (data.error) {
          this.notification.showMessage("error", data.error.message);
        } else {
          this.notification.showMessage("success", data.data.message);
          this.reloadDatatable();
        }
      });
    }   
  }

  onReset() {
    $("form.frm-detail").validate().resetForm();
    this.globalMasterService.resetModel();
    this.detailInfo = this.globalMasterService.getModel();
    this.reloadDatatable();
    this.getCompanies(this.detailInfo.global_type, this.detailInfo.global_sector).then(data => {
      this.companies = [...data];
        this.detailInfo = Object.assign({}, this.detailInfo, {
          company_id: data[0].company_id
        });
        this.companyIdSelected = data[0].company_id;
    });
  }

  onDelete() {
      this.notification.confirmDialog(
          "Deleting this item ?",
          `Do you want to continue?`,
          x => {
              if (x) {
                  this.globalMasterService.deleteGlobal(this.detailInfo).then(data => {
                      if (data.error) {
                          if (data.error.code === 403) {
                            this.notification.showMessage("error", data.error.message);
                            }
                          this.notification.showMessage("error", data.error.message);
                      } else {
                          this.notification.showMessage("success", data.data.message);
                          this.onReset();
                      }
                  })
              }
          }
      );
  }

  onChangeGlobalType(globalType, globalSectors) {
    this.loadCompanies(globalType, globalSectors);
  }

  private loadCompanies(global_type, global_sector) {
    this.globalMasterService.listCompanyBySeq(global_type, global_sector).then(data => {
      this.companies = [...data];
      this.detailInfo = Object.assign({}, this.detailInfo, {
        company_id: data[0].company_id
      });
    });
  }

  private getCompanies(global_type, global_sector){   
    return new Promise<CompanyModel[]>((resolve, reject) => {
      this.globalMasterService.listCompanyBySeq(global_type, global_sector).then(data => {
        resolve(data);
      });
    });
  }

  private reloadDatatable() {
    $(".global-list-info")
      .DataTable()
      .ajax.reload();
  }
}